import React, { useEffect, useState } from 'react'
import axios from 'axios';
import lp3i from './assets/image/lp3i.png'
import { Link } from 'react-router-dom';

const Data = () => {

  const [members, setMembers] = useState([]);

  const getMembers = async () => {
    await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/events/members`)
      .then((response) => {
        setMembers(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className='w-full md:max-w-4xl mx-auto py-5'>
      <div className='flex flex-col items-center justify-center space-y-4 mb-5'>
        <Link to={`/`}><img src={lp3i} className='w-24 md:w-40' alt="Logo LP3I" /></Link>
        <button type='button' onClick={getMembers} className='bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg text-sm'>Perbarui Data</button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-xl">
                Nama Lengkap
              </th>
              <th scope="col" className="px-6 py-3">
                No. HP
              </th>
              <th scope="col" className="px-6 py-3">
                Posisi
              </th>
              <th scope="col" className="px-6 py-3 rounded-tr-xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {
              members.length > 0 ? (
                members.map((member) =>
                  <tr key={member.id} className={`${member.status ? 'bg-white' : 'bg-red-500'} border-b`}>
                    <th scope="row" className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4 font-medium whitespace-nowrap`}>
                      {member.name}
                    </th>
                    <td className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4`}>
                      {member.phone}
                    </td>
                    <td className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4`}>
                      {member.notes}
                    </td>
                    <td className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4`}>
                      {member.status ? 'Hadir' : 'Tidak Hadir'}
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={4} className='text-center text-gray-700'>Data tidak ditemukan</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default Data