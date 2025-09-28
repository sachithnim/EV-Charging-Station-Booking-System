import { Mail, CreditCard as Edit, Trash2 } from 'lucide-react';
import Table from '../../components/table/Table';


export default function UserTable({ users, onEdit, onDelete }) {
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Backoffice':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'User',
      key: 'user',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.username}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      render: (user) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          {user.email}
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role}
        </span>
      )
    },
    {
      header: 'User ID',
      key: 'id',
      render: (user) => (
        <span className="text-sm font-mono text-gray-500">{user.id}</span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user.id);
            }}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return <Table columns={columns} data={users} />;
}