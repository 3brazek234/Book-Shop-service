import LibraryView from "@/components/LibraryView";
import { cookies } from "next/headers";

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
async function getMyBooks(searchParams: any) {
  const query = buildQueryString(searchParams);
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null; 
  }

  try {
    const res = await fetch(`http://localhost:3001/books/my-books?${query}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
       console.error("❌ API Error:", res.status);
       return null;
    }

    const jsonResponse = await res.json();
    
    console.log("✅ Parsed Data:", JSON.stringify(jsonResponse, null, 2));

    return jsonResponse;

  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export default async function MyLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const response = await getMyBooks(resolvedSearchParams);

  
  const books = response?.data || [];
  const pagination = response?.data?.pagination || { 
    total: 0, 
    totalPages: 0, 
    page: 1, 
    limit: 10 
  };

  return (
    <LibraryView
      title="My Library"
      books={books}
      pagination={pagination}
      showAddButton={true}
    />
  );
}