import React, { useRef, useEffect, useState } from 'react'
import QrScanner from 'qr-scanner'
import success from './assets/animasi/success.json'
import failed from './assets/animasi/failed.json'
import lp3i from './assets/image/lp3i.png'
import global from './assets/image/global.png'
import mayasari from './assets/image/mayasari.png'
import merdeka from './assets/image/merdeka.png'
import gedung from './assets/image/gedung.jpg'

import Lottie from 'lottie-react'
import { Link } from 'react-router-dom'

const App = () => {
  const videoRef = useRef(null);
  const [found, setFound] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [member, setMember] = useState(null);

  const sendWhatsapp = (result) => {
    let data = {
      target: result.phone,
      message: `Terima kasih sudah regitrasi kak *${result.name}*!\nBerikut ini adalah informasi mengenai tempat peserta:\n\n${result.notes}`
    }
    fetch(`https://api.politekniklp3i-tasikmalaya.ac.id/whatsapp/send`, {
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
    fetch(`https://api.politekniklp3i-tasikmalaya.ac.id/events/members/presence/${result.data}`)
      .then((response) => {
        if (!response.ok) {
          alert('Network Error.')
        }
        return response.json();
      })
      .then((data) => {
        if (data.status == 404) {
          setFound(false);
          setNotFound(true);
          return setMember(null);
        }

        if (data.status == 200) {
          setFound(true);
          setNotFound(false);
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
        maxScansPerSecond: 3,
      }
    );

    qrScanner.start();

    return () => {
      qrScanner.stop();
    }
  }, []);

  return (
    <section className="bg-center bg-no-repeat h-screen bg-cover bg-gray-700 bg-blend-multiply" style={{ backgroundImage: `url(${gedung})` }}>
      <div className='w-full md:max-w-xl mx-auto relative h-screen flex flex-col items-center justify-between gap-3 pt-5'>
        <div className='flex flex-col justify-center items-center px-5 py-2 gap-4 top-0 bg-white rounded-xl border'>
          <div className='flex items-center gap-3'>
            <img src={lp3i} className='w-24 md:w-40' alt="Logo LP3I" />
            <img src={global} className='w-16 md:w-32' alt="Logo Global" />
            <img src={merdeka} className='w-10 md:w-20' alt="Logo Merdeka" />
            <img src={mayasari} className='w-8 md:w-14' alt="Logo Mayasari" />
          </div>
        </div>

        <div className='text-center text-white space-y-1'>
          <h2 className='font-bold text-2xl'>Selamat Datang Peserta</h2>
          <h3 className='text-lg'>Fitnes Power Women Nations Politeknik LP3I Kampus Tasikmalaya</h3>
          <Link to={`/data`}>Lihat Hasil</Link>
        </div>


        <div className='p-4 mx-3 bg-white border rounded-xl'>
          <video className='rounded-xl' ref={videoRef} />
        </div>

        <div className='relative py-5 w-full rounded-t-2xl border bg-white'>
          {
            notFound &&
            <div className='flex flex-col justify-center items-center gap-3'>
              <Lottie loop={true} animationData={failed} className='w-14' />
              <p className='bg-red-500 text-white px-3 py-2 text-sm rounded-lg'>Anggota tidak ditemukan!</p>
            </div>
          }

          {
            found &&
            <div className='flex flex-col justify-center items-center gap-3'>
              <Lottie loop={true} animationData={success} className='w-14' />
              <p className='bg-emerald-500 text-white px-3 py-2 text-sm rounded-lg'>Anggota ditemukan!</p>
              <ul className='text-base text-center space-y-1'>
                <li><span className='font-bold'>{member.name}</span></li>
                <li><span className='font-reguler'>{member.phone}</span></li>
                <li><span className='font-reguler'>{member.notes}</span></li>
              </ul>
            </div>
          }
        </div>
      </div>
    </section>
  )
}

export default App