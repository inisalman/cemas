'use client';
import { useState } from 'react';

const questions = ['Saya takut dibius','Saya terus menerus memikirkan tentang pembiusan','Saya ingin tahu sebanyak mungkin tentang pembiusan','Saya takut dioperasi','Saya terus menerus memikirkan tentang operasi','Saya ingin tahu sebanyak mungkin tentang operasi'];
const answers = ['Sama sekali tidak','Tidak terlalu','Sedikit','Setuju','Sangat setuju'];

export default function Quiz({phase}) {
 const [initials,setInitials]=useState('');
 const [started,setStarted]=useState(false);
 const [values,setValues]=useState(Array(6).fill(null));
 const [done,setDone]=useState(false);
 const [error,setError]=useState('');
 const [saving,setSaving]=useState(false);
 function start(e){e.preventDefault(); if(!/^(?:[\p{L}]{1,4}|[\p{L}](?:[ .-][\p{L}]){1,3})$/u.test(initials.trim())) {setError('Masukkan inisial saja, misalnya S A.');return} setError('');setStarted(true)}
 async function submit(e){
  e.preventDefault(); if(values.some(v=>v===null)){setError('Pilih jawaban untuk semua pernyataan terlebih dahulu, ya.');return}
  setError('');setSaving(true);
  try {
   let participantId=localStorage.getItem('ruang-tenang-participant');
   if(!participantId){participantId=crypto.randomUUID();localStorage.setItem('ruang-tenang-participant',participantId)}
   const response=await fetch('/api/results',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initials,phase,answers:values.map(v=>v+1),participantId})});
   const data=await response.json(); if(!response.ok) throw new Error(data.error); setDone(true);
  } catch(err){setError(err.message || 'Jawaban belum berhasil disimpan. Silakan coba lagi.')} finally {setSaving(false)}
 }
 const anxietyScore = [0,1,3,4].reduce((sum,i)=>sum+(values[i]??0)+1,0);
 const informationScore = [2,5].reduce((sum,i)=>sum+(values[i]??0)+1,0);
 const elevated = anxietyScore >= 11;
 return <div className="quiz-box">{done ? <div className="result" role="status"><span className="eyebrow">HASIL SKRINING APAIS</span><h3>{phase==='pre'?'Hasil sebelum relaksasi':'Hasil setelah relaksasi'}</h3><div className="score-grid"><div className="score-primary"><span>Skor kecemasan</span><strong>{anxietyScore} <small>/ 20</small></strong><p>{elevated?'Skor mencapai batas skrining kecemasan':'Skor di bawah batas skrining kecemasan'}</p></div><div className="score-secondary"><span>Kebutuhan informasi</span><strong>{informationScore} <small>/ 10</small></strong><p>Skor ini menunjukkan kebutuhan informasi tentang pembiusan dan operasi.</p></div></div><p className="score-explanation">Skor kecemasan dihitung dari pertanyaan 1, 2, 4, dan 5. Batas skrining yang digunakan adalah 11 dari 20. Hasil ini bukan diagnosis; diskusikan kekhawatiranmu dengan tenaga kesehatan yang mendampingimu.</p><p>Jawaban dan inisialmu telah disimpan untuk dilihat admin.</p><div className="result-actions"><button className="button secondary" onClick={()=>{setValues(Array(6).fill(null));setDone(false);setStarted(false)}}>Isi ulang</button><a className="text-link" href={phase==='pre'?'/intervensi':'/'}>{phase==='pre'?'Lanjut ke panduan relaksasi':'Kembali ke beranda'}</a></div></div> : !started ? <form onSubmit={start}><div className="quiz-top"><div><span className="eyebrow">DATA DIRI</span><h3>Sebelum mulai, isi inisialmu.</h3><p>Cukup inisial nama, tanpa nama lengkap. Gunakan inisial yang sama untuk pre-test dan post-test.</p></div></div><label className="field-label" htmlFor="initials">Inisial nama</label><input className="text-input" id="initials" value={initials} onChange={e=>setInitials(e.target.value)} maxLength={23} autoComplete="off" placeholder="Contoh: S A" required/><p className="privacy">Inisial dan jawaban akan disimpan dan dapat dilihat oleh admin.</p>{error&&<p className="error" role="alert">{error}</p>}<button className="button form-button" type="submit">Lanjut ke pertanyaan</button></form> : <form onSubmit={submit}><div className="quiz-top"><div><span className="eyebrow">{phase==='pre'?'SEBELUM RELAKSASI':'SETELAH RELAKSASI'}</span><h3>{phase==='pre'?'Bagaimana perasaanmu sekarang?':'Bagaimana perasaanmu setelah mencoba?'}</h3><p>Pilih satu jawaban yang paling sesuai untuk setiap pernyataan. Inisial: {initials.toUpperCase()}</p></div><span className="count">{values.filter(v=>v!==null).length} / 6</span></div>{questions.map((q,i)=><fieldset key={q}><legend><span>{String(i+1).padStart(2,'0')}</span>{q}</legend><div className="options">{answers.map((a,j)=><label key={a} className={values[i]===j?'selected':''}><input type="radio" name={`${phase}-${i}`} checked={values[i]===j} onChange={()=>setValues(values.map((v,k)=>k===i?j:v))}/><span>{a}</span></label>)}</div></fieldset>)}{error&&<p className="error" role="alert">{error}</p>}<button className="button" type="submit" disabled={saving}>{saving?'Menyimpan...':'Simpan dan lihat hasil'}</button><p className="privacy">Inisial dan jawaban akan disimpan dan dapat dilihat oleh admin.</p></form>}</div>
}
