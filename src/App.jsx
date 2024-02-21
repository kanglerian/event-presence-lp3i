import React, { useRef, useEffect, useState } from 'react'
import QrScanner from 'qr-scanner'
import success from './assets/animasi/success.json'
import failed from './assets/animasi/failed.json'
import lp3i from './assets/image/lp3i.png'
import global from './assets/image/global.png'

import Lottie from 'lottie-react'

const App = () => {
  const videoRef = useRef(null);
  const [show, setShow] = useState(false);
  const [found, setFound] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [member, setMember] = useState(null);

  const sendWhatsapp = (result) => {
    let data = {
      target: result.phone,
      message: `Halo, terima kasih sudah registrasi!\n\n${result.notes}`
    }
    fetch(`https://opac.politekniklp3i-tasikmalaya.ac.id:8443/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          console.log('Network Error.');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const getMember = (result) => {
    setShow(false);
    fetch(`https://api.politekniklp3i-tasikmalaya.ac.id/events/members/presence/${result.data}`)
      .then((response) => {
        if (!response.ok) {
          alert('Network Error.')
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status == 404) {
          setFound(false);
          setNotFound(true);
          setShow(false);
          return setMember(null);
        }

        if (data.status == 200) {
          setFound(true);
          setNotFound(false);
          setShow(true);
          if (!data.data.status) {
            sendWhatsapp(data.data);
          }
          return setMember(data.data)
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      result => getMember(result),
      {
        highlightScanRegion: true,
        maxScansPerSecond: 3,
      }
    );

    qrScanner.start();

    return () => {
      qrScanner.stop();
    }
  }, []);

  return (
    <section className='relative h-screen flex flex-col items-center justify-center'>
      <div className='fixed flex flex-row justify-center items-center py-2 px-24 m-5 gap-4 top-0 bg-white rounded-full border shadow-lg'>
        <img src={lp3i} className='App-logo w-36' alt="Logo LP3I" />
        <img src={global} className='App-logo w-32' alt="Logo Global" />
        <div>
          <p className='hidden md:block text-wrap text-slate-800 font-normal text-lg'>Selamat Datang di Acara Seminar Teuing Teu Apal Naon <span className='font-bold text-cyan-800'> Politeknik LP3I Kampus Tasikmalaya</span></p>      
        </div>
      </div>
        <div className='flex flex-col justify-center items-center gap-3 text-center'>
          <p className='md:hidden -mt-56 md:mt-28 p-4 text-wrap text-slate-800 font-normal text-lg'>Selamat Datang di Acara Seminar Teuing Teu Apal Naon <span className='font-bold text-cyan-800'> Politeknik LP3I Kampus Tasikmalaya</span></p>
         {
          notFound &&
          <div className='hidden md:block mt-5 md:mb-3'>
            <span className='p-2 flex justify-center'>
            <Lottie loop={true} animationData={failed} className='w-16'/>
            </span>
            <p className='bg-red-500 text-white p-2 text-sm rounded-lg'>Anggota tidak ditemukan!</p>
          </div>
         }
        
        {
          found &&
          <div className='hidden md:block md:mb-3'>
            <span className='p-2 mt-24 flex justify-center'>
            <Lottie loop={true} animationData={success} className='w-16'/>
            </span>
            <p className='bg-emerald-500 text-white p-2 text-sm rounded-lg'>Anggota ditemukan!</p>
            <ul className='m-2'>
              <li>Nama: <span className='font-bold'>{member.name}</span></li>
              <li>No. Telpon: <span className='font-bold'>{member.phone}</span></li>
              <li>Catatan: <span className='font-bold'>{member.notes}</span></li>
            </ul>
          </div>
        }
        
        </div>
        <div className='p-4 mx-6 -mt-12 md:mt-0 w-full md:w-1/2 bg-white border rounded-xl shadow-lg'>
          <video className='rounded-xl shadow-lg' ref={videoRef} />
        </div>

        <div className='md:hidden absolute mt-10 w-full shadow-2xl rounded-t-3xl bottom-0 h-1/3 border bg-white'>
        {
          notFound &&
          <div className='flex flex-col justify-center items-center mt-8'>
            <span className='p-2 flex justify-center'>
            <Lottie loop={true} animationData={failed} className='w-16'/>
            </span>
            <p className='bg-red-500 text-white p-2 text-sm rounded-lg'>Anggota tidak ditemukan!</p>
          </div>
        }

        {
          found &&
          <div className='flex flex-col justify-center items-center'>
            <span className='p-2 md:mt-16 flex justify-center'>
            <Lottie loop={true} animationData={success} className='w-16'/>
            </span>
            <p className='bg-emerald-500 text-white p-2 text-sm rounded-lg'>Anggota ditemukan!</p>
            <ul className='m-2'>
              <li>Nama: <span className='font-bold'>{member.name}</span></li>
              <li>No. Telpon: <span className='font-bold'>{member.phone}</span></li>
              <li>Catatan: <span className='font-bold'>{member.notes}</span></li>
            </ul>
          </div>
        }
        </div>
    </section>
  )
}

export default App