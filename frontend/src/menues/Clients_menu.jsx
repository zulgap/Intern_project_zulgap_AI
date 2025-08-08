// 동료사 관리 메뉴

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Clients_menu = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: '테크스타트업 A',
      contact: 'contact@startup-a.com',
      status: '활성',
      lastContact: '2024-01-15'
    },
    {
      id: 2,
      name: '마케팅 에이전시 B',
      contact: 'hello@agency-b.co.kr',
      status: '대기',
      lastContact: '2024-01-10'
    },
    {
      id: 3,
      name: '컨설팅 회사 C',
      contact: 'info@consulting-c.com',
      status: '활성',
      lastContact: '2024-01-12'
    }
  ]);

  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');

  const addClient = () => {
    if (newClientName && newClientContact) {
      const newClient = {
        id: clients.length + 1,
        name: newClientName,
        contact: newClientContact,
        status: '대기',
        lastContact: new Date().toISOString().split('T')[0]
      };
      setClients([...clients, newClient]);
      setNewClientName('');
      setNewClientContact('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '활성':
        return 'bg-green-100 text-green-800';
      case '대기':
        return 'bg-yellow-100 text-yellow-800';
      case '중단':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Common Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">동료사 관리</h2>
              <p className="text-sm text-gray-600">협업 파트너사들을 관리합니다</p>
            </div>
          </div>
        </header>

        {/* Clients Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Add New Client Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">새 동료사 추가</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="회사명"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="연락처 이메일"
                    value={newClientContact}
                    onChange={(e) => setNewClientContact(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={addClient}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </div>

            {/* Clients List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">동료사 목록</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        회사명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        연락처
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        마지막 연락
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.lastContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">
                            편집
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients_menu;