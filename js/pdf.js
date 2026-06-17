// FUNGSI UNTUK MENYIAPKAN CANVAS TTD
function prepareSignatures() {
    const canvas1 = document.getElementById('sig-pad-1');
    const imgSig1 = document.getElementById('img-sig-1');
    imgSig1.src = canvas1.toDataURL("image/png");
    imgSig1.classList.remove('hidden');

    const canvas2 = document.getElementById('sig-pad-2');
    const imgSig2 = document.getElementById('img-sig-2');
    imgSig2.src = canvas2.toDataURL("image/png");
    imgSig2.classList.remove('hidden');
}

// LOGIC PREVIEW MODAL
document.getElementById('btn-preview').addEventListener('click', () => {
    const form = document.getElementById('ba-form');
    if (!form.checkValidity()) {
        form.reportValidity(); 
        alert("Gagal Preview: Mohon lengkapi seluruh field isian data (wajib isi) terlebih dahulu.");
        return;
    }
    prepareSignatures();
    document.getElementById('preview-modal').classList.remove('hidden');
});

// LOGIC TUTUP PREVIEW
document.getElementById('btn-modal-back').addEventListener('click', () => {
    document.getElementById('preview-modal').classList.add('hidden');
});

// FUNGSI UTAMA GENERATE PDF
async function generatePDF(btnElement) {
    const form = document.getElementById('ba-form');
    
    if (!form.checkValidity()) {
        form.reportValidity(); 
        alert("Gagal mengunduh: Mohon lengkapi seluruh field isian data terlebih dahulu!");
        return;
    }

    const originalBtnText = btnElement.innerHTML;
    btnElement.innerHTML = 'Memproses PDF...';
    btnElement.disabled = true;

    const modal = document.getElementById('preview-modal');
    const wasHidden = modal.classList.contains('hidden');

    try {
        prepareSignatures();

        if (wasHidden) {
            modal.classList.remove('hidden');
            modal.style.position = 'absolute';
            modal.style.left = '-9999px'; 
        }

        // Buat Nama File Dinamis
        let dateStr = "Tgl-Belum-Diisi";
        const dateInput = document.getElementById('in-tanggal-lengkap').value;
        if(dateInput) {
            const d = new Date(dateInput);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            dateStr = `${day}_${month}_${year}`;
        }
        const kelurahanStr = document.getElementById('in-kelurahan').value || "Kel-Belum-Diisi";
        const safeKelurahan = kelurahanStr.replace(/\s+/g, '_');
        const pdfFileName = `BA_PH_${dateStr}_${safeKelurahan}.pdf`;

        // Render PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        window.scrollTo(0,0);
        
        // Atur rasio rendering (scale 2 cukup jelas namun jika ingin lebih kecil lagi ukurannya bisa ganti ke 1.5)
        const renderOptions = {
            scale: 2, 
            useCORS: true, 
            logging: false, 
            backgroundColor: '#ffffff'
        };

        // HALAMAN 1
        const page1 = document.getElementById('page-1');
        const canvasPage1 = await html2canvas(page1, renderOptions);
        
        // --- PERBAIKAN KOMPRESI DISINI ---
        // Ubah dari PNG ke JPEG kualitas 75% (0.75), ukuran akan terjun bebas.
        const imgData1 = canvasPage1.toDataURL('image/jpeg', 0.75); 
        // Menggunakan mode kompresi 'FAST' bawaan jsPDF
        pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        // HALAMAN 2
        pdf.addPage();
        const page2 = document.getElementById('page-2');
        const canvasPage2 = await html2canvas(page2, renderOptions);
        
        // --- PERBAIKAN KOMPRESI DISINI ---
        const imgData2 = canvasPage2.toDataURL('image/jpeg', 0.75);
        pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        // Download File Akhir
        pdf.save(pdfFileName);

    } catch (err) {
        console.error("Error saat memproses konversi PDF:", err);
        alert("Terjadi masalah sistem saat memproses berkas cetak PDF.");
    } finally {
        // Reset state
        btnElement.innerHTML = originalBtnText;
        btnElement.disabled = false;
        
        if (wasHidden) {
            modal.classList.add('hidden');
            modal.style.position = '';
            modal.style.left = '';
        }
        
        document.getElementById('img-sig-1').classList.add('hidden');
        document.getElementById('img-sig-2').classList.add('hidden');
    }
}

// BIND KEDUA TOMBOL DOWNLOAD KE FUNGSI UTAMA
document.getElementById('btn-download-main').addEventListener('click', function() {
    generatePDF(this);
});

document.getElementById('btn-modal-download').addEventListener('click', function() {
    generatePDF(this);
});