import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '@/api/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save, Plus, HelpCircle, Calendar, Trophy, Users, Edit3 } from 'lucide-react';
import gsap from '@/animations/gsapConfig';

const INPUT_CLASS = "!border-0 !rounded-xl bg-[#18412E]/60 hover:bg-[#18412E]/80 focus:bg-[#18412E] focus:ring-1 focus:ring-[#70C492]/50 focus:shadow-[0_0_15px_rgba(112,196,146,0.15)] transition-all duration-300 outline-none text-white placeholder:text-[#7A9A8A]";

const INITIAL = {
  nama: '', slug: '', kategori: 'siswa', deskripsi: '',
  persyaratan: '[]', ketentuan: '', hadiah_1: '', hadiah_2: '', hadiah_3: '',
  benefit: '', deadline: '', kuota: 50, status: 'buka',
};

export default function LombaFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form,  setForm]  = useState(INITIAL);
  const [customFields, setCustomFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bookletFile, setBookletFile] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/lomba/${id}`)
        .then(({ data }) => {
          const d = data.data ?? data;
          setForm({
            ...INITIAL,
            ...d
          });
          if (d.persyaratan) {
            if (Array.isArray(d.persyaratan)) {
              setCustomFields(d.persyaratan);
            } else {
              try {
                setCustomFields(JSON.parse(d.persyaratan));
              } catch (e) {
                setCustomFields([]);
              }
            }
          }
        })
        .catch(() => navigate('/admin/lomba'));
    }
  }, [id]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current.querySelectorAll('.animate-in'),
        { opacity: 0, y: 30, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.08 }
      );
    }
  }, []);

  const addField = () => {
    setCustomFields([...customFields, { label: '', type: 'text', required: true }]);
  };

  const removeField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const update = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === 'nama' && !isEdit) {
      setForm((p) => ({ 
        ...p, 
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        if (key !== 'banner_url' && key !== 'booklet_url' && key !== 'banner_path' && key !== 'booklet_path') {
          payload.append(key, val);
        }
      }
    });

    if (bannerFile) {
      payload.append('banner', bannerFile);
    }
    if (bookletFile) {
      payload.append('booklet', bookletFile);
    }
    


    try {
      if (isEdit) {
        await api.post(`/admin/lomba/${id}`, payload);
      } else {
        await api.post('/admin/lomba', payload);
      }
      navigate('/admin/lomba');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={formRef} className="w-full space-y-6 pb-10">
      
      {/* Back button */}
      <Link to="/admin/lomba" className="animate-in inline-flex items-center gap-2 text-text-muted hover:text-neon-teal text-sm transition-colors">
        <ArrowLeft size={15} /> Kembali ke Cabang Lomba
      </Link>

      {/* Header */}
      <div className="animate-in">
        <h1 className="font-display text-3xl font-black text-white uppercase tracking-tight">
          {isEdit ? 'Edit Cabang Lomba' : 'Tambah Lomba Baru'}
        </h1>
        <p className="text-[#9dd5b8] text-sm mt-1.5">
          {isEdit ? 'Perbarui informasi dan tenggat waktu kompetisi' : 'Rilis cabang kompetisi baru untuk menarik inovator terbaik.'}
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="animate-in bg-white/[0.01] backdrop-blur-[35px] border border-white/[0.04] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 rounded-3xl space-y-5">
        
        {/* Name & Slug */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Input 
            label="Nama Lomba" 
            name="nama" 
            placeholder="Contoh: Web Development"
            value={form.nama} 
            onChange={update}
            className={INPUT_CLASS}
            error={errors.nama?.[0]} 
            required 
          />
          <Input 
            label="Slug (URL)" 
            name="slug" 
            placeholder="web-development"
            value={form.slug} 
            onChange={update}
            className={INPUT_CLASS}
            error={errors.slug?.[0]} 
            hint="Otomatis terisi dari nama" 
            required 
          />
        </div>

        {/* Category */}
        <Input 
          label="Kategori Peserta Lomba" 
          name="kategori" 
          as="select" 
          value={form.kategori} 
          onChange={update}
          className={INPUT_CLASS}
          error={errors.kategori?.[0]} 
          required
        >
          <option value="" className="bg-[#18412E] text-[#7A9A8A]">-- Pilih Kategori --</option>
          <option value="siswa" className="bg-[#18412E] text-white">Siswa SMA/SMK Sederajat</option>
          <option value="mahasiswa" className="bg-[#18412E] text-white">Mahasiswa</option>
        </Input>

        {/* Description */}
        <Input 
          label="Deskripsi Lengkap (Detail Lomba)" 
          name="deskripsi" 
          as="textarea" 
          rows={5}
          placeholder="Deskripsikan persyaratan karya, teknologi, atau spesifikasi lomba secara mendalam..."
          value={form.deskripsi || ''} 
          onChange={update} 
          className={INPUT_CLASS}
          error={errors.deskripsi?.[0]} 
          required 
        />

        {/* Prizes Juara 1, 2, 3 */}
        <div className="grid sm:grid-cols-3 gap-5">
          <Input 
            label="Hadiah Juara 1" 
            name="hadiah_1" 
            placeholder="Contoh: Rp 1.500.000 + Sertifikat"
            value={form.hadiah_1 || ''} 
            onChange={update} 
            className={INPUT_CLASS}
            error={errors.hadiah_1?.[0]}
          />
          <Input 
            label="Hadiah Juara 2" 
            name="hadiah_2" 
            placeholder="Contoh: Rp 1.000.000 + Sertifikat"
            value={form.hadiah_2 || ''} 
            onChange={update} 
            className={INPUT_CLASS}
            error={errors.hadiah_2?.[0]}
          />
          <Input 
            label="Hadiah Juara 3" 
            name="hadiah_3" 
            placeholder="Contoh: Rp 750.000 + Sertifikat"
            value={form.hadiah_3 || ''} 
            onChange={update} 
            className={INPUT_CLASS}
            error={errors.hadiah_3?.[0]}
          />
        </div>

        {/* Dates and Quota */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Input 
            label="Deadline Pendaftaran (Tanggal & Waktu)" 
            name="deadline" 
            type="datetime-local"
            value={form.deadline ? form.deadline.substring(0, 16) : ''} 
            onChange={update} 
            className={INPUT_CLASS}
            error={errors.deadline?.[0]}
            required
          />
          <Input 
            label="Kuota Peserta Lomba" 
            name="kuota" 
            type="number"
            min={0}
            value={form.kuota || 0} 
            onChange={update} 
            className={INPUT_CLASS}
            error={errors.kuota?.[0]}
            required
          />
        </div>

        {/* Status Dropdown */}
        <Input 
          label="Status Lomba" 
          name="status" 
          as="select"
          value={form.status || 'buka'} 
          onChange={update}
          className={INPUT_CLASS}
        >
          <option value="draft" className="bg-[#18412E] text-white">Draft (Belum Buka)</option>
          <option value="buka" className="bg-[#18412E] text-white">Buka (Pendaftaran Aktif)</option>
          <option value="tutup" className="bg-[#18412E] text-white">Tutup (Selesai/Berakhir)</option>
        </Input>

        {/* Banner and Booklet Uploads */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="font-display text-xs text-[#7A9A8A] tracking-widest uppercase block mb-2">Banner Lomba (Gambar)</label>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="block w-full text-xs text-[#7A9A8A] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#18412E]/60 file:text-[#70C492] hover:file:bg-[#18412E]/80 cursor-pointer"
              />
              {form.banner_url && !bannerFile && (
                <a href={form.banner_url} target="_blank" rel="noreferrer" className="text-xs text-[#70C492] hover:underline flex items-center gap-1">
                  Lihat Banner Saat Ini
                </a>
              )}
              {bannerFile && (
                <span className="text-xs text-white/50">Terpilih: {bannerFile.name}</span>
              )}
            </div>
          </div>

          <div>
            <label className="font-display text-xs text-[#7A9A8A] tracking-widest uppercase block mb-2">Booklet Lomba (PDF / File)</label>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept=".pdf,.zip,.doc,.docx,image/*"
                onChange={(e) => setBookletFile(e.target.files[0])}
                className="block w-full text-xs text-[#7A9A8A] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#18412E]/60 file:text-[#70C492] hover:file:bg-[#18412E]/80 cursor-pointer"
              />
              {form.booklet_url && !bookletFile && (
                <a href={form.booklet_url} target="_blank" rel="noreferrer" className="text-xs text-[#70C492] hover:underline flex items-center gap-1">
                  Lihat Booklet Saat Ini
                </a>
              )}
              {bookletFile && (
                <span className="text-xs text-white/50">Terpilih: {bookletFile.name}</span>
              )}
            </div>
          </div>
        </div>


        {/* Submit */}
        <div className="flex justify-end pt-5 border-t border-white/[0.04] mt-6">
          <Button 
            type="submit" 
            variant="solid" 
            className="bg-[#70C492] hover:brightness-[1.15] text-[#112C1E] font-bold px-6.5 py-3.5 flex items-center gap-1.5 shadow-[0_0_15px_rgba(112,196,146,0.25)] rounded-xl border-none outline-none"
            loading={saving} 
            leftIcon={<Save size={16} />}
          >
            {isEdit ? 'Simpan Perubahan' : 'Buat Lomba'}
          </Button>
        </div>
      </form>
    </div>
  );
}
