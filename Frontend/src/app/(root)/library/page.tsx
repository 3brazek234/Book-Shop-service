import LibraryView from "@/components/LibraryView";

const buildQueryString = (params: { [key: string]: string | string[] | undefined }) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value) && value.length > 0) {
      query.set(key, value[0]);
    }
  });

  return query.toString();
};

async function getPublicBooks(searchParams: any) {
  const query = buildQueryString(searchParams);
  
  const res = await fetch(`http://localhost:3001/books/all?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
     // تعامل مع الخطأ بذكاء عشان الصفحة متضربش
     console.error("Failed to fetch books");
     return { data: { books: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 10 } } };
  }
  return res.json();
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const response = await getPublicBooks(searchParams);

  // تأكد إن الداتا موجودة قبل ما تبعتها
  const books = response?.data?.books || [];
  const pagination = response?.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 };

  return (
    <LibraryView
      title="Library"
      books={books}
      pagination={pagination}
      showAddButton={false}
    />
  );
}