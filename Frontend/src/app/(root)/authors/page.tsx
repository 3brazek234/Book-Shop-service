import api from "@/lib/api";

type AuthorResponse = {
  success: boolean;
  data: Author[];
};
type Author = {
  id: string;
  name: string;
  bio: string;
  image?: string;
};
const fetchAuthors = async (): Promise<AuthorResponse> => {
  try {
    const response = await api.get("/authors");
    console.log("Fetched Authors:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch authors", error);
    return { success: false, data: [] };
  }
};

export default async function AuthorsPage() {
  const { data: authors } = await fetchAuthors();
  return (
    <section className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Authors</h2>
      </div>

      {/* Grid of Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-white">
                {author.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {author.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
