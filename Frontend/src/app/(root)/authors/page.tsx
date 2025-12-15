'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
              + Add Author
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">إضافة مؤلف جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAuthor} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">اسم المؤلف</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-white">صورة (رابط URL)</Label>
                <Input
                  id="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newAuthor.image}
                  onChange={(e) => setNewAuthor({...newAuthor, image: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">نبذة (Bio)</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor({...newAuthor, bio: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/5"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium"
                >
                  حفظ
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid of Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            {/* Image Area */}
            <div className="h-48 w-full bg-gray-800 relative">
              <img
                src={author.image}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Area */}
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-white">{author.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {author.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}