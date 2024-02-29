import React, { useEffect, useState } from 'react'
import axios from 'axios';

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
    <div className='w-full md:max-w-3xl mx-auto py-5'>
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
              <th scope="col" className="px-6 py-3 rounded-tr-xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {
              members.length > 0 ? (
                members.map((member) =>
                  <tr className={`${member.status ? 'bg-white' : 'bg-red-500'} border-b`}>
                    <th scope="row" className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4 font-medium whitespace-nowrap`}>
                      {member.name}
                    </th>
                    <td className={`${member.status ? 'text-gray-900' : 'text-white'} px-6 py-4`}>
                      {member.phone}
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