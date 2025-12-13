'use client'

import { useState } from 'react'

// 1. تعريف شكل بيانات المؤلف
type Author = {
  id: number
  name: string
  bio: string
  image: string
}

// بيانات وهمية للتجربة
const initialAuthors: Author[] = [
  {
    id: 1,
    name: "أحمد خالد توفيق",
    bio: "كاتب وطبيب مصري، ويعد أول كاتب عربي في مجال أدب الرعب.",
    image: "https://placehold.co/400x400/2c3e50/fff?text=AKT"
  },
  {
    id: 2,
    name: "نجيب محفوظ",
    bio: "أول أديب عربي حائز على جائزة نوبل في الأدب.",
    image: "https://placehold.co/400x400/e67e22/fff?text=NM"
  }
]

export default function AuthorsList() {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State للبيانات الجديدة
  const [newAuthor, setNewAuthor] = useState({ name: '', bio: '', image: '' })

  // دالة إضافة مؤلف جديد
  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthor.name || !newAuthor.bio) return alert('الرجاء ملء البيانات')

    const authorToAdd: Author = {
      id: Date.now(), // ID مؤقت
      name: newAuthor.name,
      bio: newAuthor.bio,
      image: newAuthor.image || "https://placehold.co/400x400/3498db/fff?text=New" // صورة افتراضية
    }

    setAuthors([...authors, authorToAdd]) // تحديث القائمة
    setNewAuthor({ name: '', bio: '', image: '' }) // تصفير الفورم
    setIsModalOpen(false) // غلق المودال
  }

  return (
    <section className="p-8 min-h-screen">
      
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Authors</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+ Add Author</span>
        </button>
      </div>

      {/* Grid of Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
            {/* Image Area */}
            <div className="h-48 w-full bg-gray-200 relative">
              <img 
                src={author.image} 
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Area */}
            <div className="p-5 ">
              <h3 className="text-xl font-bold mb-2 text-white">{author.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {author.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Popup for Adding Author */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">إضافة مؤلف جديد</h3>
              
              <form onSubmit={handleAddAuthor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المؤلف</label>
                  <input 
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">صورة (رابط URL)</label>
                  <input 
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newAuthor.image}
                    onChange={(e) => setNewAuthor({...newAuthor, image: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نبذة (Bio)</label>
                  <textarea 
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newAuthor.bio}
                    onChange={(e) => setNewAuthor({...newAuthor, bio: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}