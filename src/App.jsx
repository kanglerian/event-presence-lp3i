import React, { useRef, useEffect, useState } from 'react'
import QrScanner from 'qr-scanner'

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
    fetch(`http://localhost:3000/members/presence/${result.data}`)
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
      <div className='absolute top-5 flex flex-col justify-center items-center gap-3 text-center'>
        {
          found &&
          <p className='bg-emerald-500 text-white p-3 rounded-lg'>Anggota ditemukan!</p>
        }
        {
          notFound &&
          <p className='bg-red-500 text-white p-3 rounded-lg'>Anggota tidak ditemukan!</p>
        }
        {
          show &&
          <ul>
            <li>Nama: {member.name}</li>
            <li>No. Telpon: {member.phone}</li>
            <li>Catatan: {member.notes}</li>
          </ul>
        }
        </div>
      <video className='w-full md:w-1/2 md:rounded-xl' ref={videoRef} />
    </section>
  )
}

export default App