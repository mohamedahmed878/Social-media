import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import GroupCard from '../components/GroupCard';
import UserCard from '../components/UserCard';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getMyGroups, createGroup } from '../services/groupApi';
import { searchUsers } from '../services/userApi';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadGroups = () => getMyGroups().then(setGroups);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    const id = setTimeout(() => searchUsers(search).then(setResults), 300);
    return () => clearTimeout(id);
  }, [search]);

  const toggleMember = (u) => {
    setSelected((prev) =>
      prev.some((p) => p._id === u._id) ? prev.filter((p) => p._id !== u._id) : [...prev, u]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createGroup({ name, description, memberIds: selected.map((s) => s._id) });
    setName('');
    setDescription('');
    setSelected([]);
    setSearch('');
    setShowForm(false);
    loadGroups();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="الجروبات" />
      <div style={{ padding: 24 }}>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'إلغاء' : '+ إنشاء جروب جديد'}
        </button>

        {showForm && (
          <form onSubmit={handleCreate} className="card" style={{ padding: 22, marginTop: 16, maxWidth: 480 }}>
            <input
              className="input"
              placeholder="اسم الجروب"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginBottom: 12 }}
            />
            <textarea
              className="input"
              placeholder="وصف مختصر (اختياري)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ marginBottom: 12, resize: 'vertical' }}
            />
            <input
              className="input"
              placeholder="دور على أعضاء تضيفهم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            {results.length > 0 && (
              <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 8 }}>
                {results.map((r) => (
                  <UserCard
                    key={r._id}
                    user={r}
                    onClick={() => toggleMember(r)}
                    selected={selected.some((s) => s._id === r._id)}
                  />
                ))}
              </div>
            )}
            {selected.length > 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                هيتضاف: {selected.map((s) => s.name).join('، ')}
              </p>
            )}
            <button className="btn btn-primary" type="submit">
              إنشاء الجروب
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gap: 14, marginTop: 24, maxWidth: 640 }}>
          {groups.length === 0 && (
            <EmptyState icon="👥" title="لسه معملتش أي جروب" subtitle="دوس على + إنشاء جروب جديد عشان تبدأ." />
          )}
          {groups.map((g) => (
            <GroupCard key={g._id} group={g} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;
