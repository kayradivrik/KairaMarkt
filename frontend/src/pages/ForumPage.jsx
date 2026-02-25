import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopics, getTopicBySlug, createTopic, createPost } from '../services/forumService';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiSearch, FiArrowLeft } from 'react-icons/fi';

export default function ForumPage() {
  const { slug } = useParams();
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (slug) {
      getTopicBySlug(slug)
        .then((r) => {
          setTopic(r.data.topic);
          setPosts(r.data.posts || []);
        })
        .catch(() => {
          setTopic(null);
          setPosts([]);
        })
        .finally(() => setLoading(false));
    } else {
      getTopics()
        .then((r) => setTopics(r.data.topics || []))
        .catch(() => setTopics([]))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.trim().toLowerCase();
    return topics.filter((t) => (t.title || '').toLowerCase().includes(q));
  }, [topics, searchQuery]);

  const totalPosts = useMemo(() => topics.reduce((acc, t) => acc + (t.postCount ?? 0), 0), [topics]);

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    setSubmitting(true);
    createTopic({ title: newTopicTitle.trim() })
      .then((r) => {
        setTopics((prev) => [r.data.topic, ...prev]);
        setNewTopicTitle('');
        toast.success('Konu açıldı');
      })
      .catch((err) => toast.error(err.message || 'Konu açılamadı'))
      .finally(() => setSubmitting(false));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!topic?._id || !newPostAuthor.trim() || !newPostContent.trim()) return;
    setSubmitting(true);
    createPost({ topicId: topic._id, authorName: newPostAuthor.trim(), content: newPostContent.trim() })
      .then((r) => {
        setPosts((prev) => [...prev, r.data.post]);
        setNewPostContent('');
        toast.success('Mesaj gönderildi');
      })
      .catch((err) => toast.error(err.message || 'Gönderilemedi'))
      .finally(() => setSubmitting(false));
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '');

  if (slug) {
    return (
      <div className="forum-page">
        <div className="forum-container">
          <p className="forum-breadcrumb">
            <Link to="/forum">Forum</Link>
            {topic && <> &rarr; {topic.title}</>}
          </p>

          {loading ? (
            <p className="forum-muted">Yükleniyor...</p>
          ) : !topic ? (
            <p className="forum-muted">Konu bulunamadı.</p>
          ) : (
            <>
              <h1 className="forum-title">{topic.title}</h1>

              <div className="forum-posts">
                {posts.length === 0 ? (
                  <p className="forum-muted">Henüz mesaj yok. İlk yorumu siz yapın.</p>
                ) : (
                  posts.map((post) => (
                    <article key={post._id} className="forum-post">
                      <header className="forum-post-head">
                        <strong>{post.authorName}</strong>
                        <time className="forum-muted">{formatDate(post.createdAt)}</time>
                      </header>
                      <div className="forum-post-body">{post.content}</div>
                    </article>
                  ))
                )}
              </div>

              <form onSubmit={handleCreatePost} className="forum-form">
                <h2 className="forum-subtitle">Yanıt yaz</h2>
                <div className="forum-form-row">
                  <label htmlFor="forum-author">Adınız</label>
                  <input
                    id="forum-author"
                    type="text"
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                    required
                    placeholder="Adınız veya takma ad"
                  />
                </div>
                <div className="forum-form-row">
                  <label htmlFor="forum-content">Mesaj</label>
                  <textarea
                    id="forum-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    required
                    rows={5}
                    placeholder="Düşüncenizi yazın..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="forum-btn">
                  {submitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>

              <p className="forum-back">
                <Link to="/forum"><FiArrowLeft className="inline-block mr-1 w-4 h-4 align-middle" /> Konu listesine dön</Link>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="forum-page">
      <div className="forum-container">
        <div className="forum-hero">
          <h1 className="forum-title">Forum</h1>
          <p className="forum-lead">Konuları okuyabilir, tartışmaya katılabilirsiniz.</p>
          <div className="forum-stats">
            <span className="forum-stat">{topics.length} konu</span>
            <span className="forum-stat">{totalPosts} mesaj</span>
          </div>
        </div>

        <form onSubmit={handleCreateTopic} className="forum-form forum-form-inline">
          <input
            type="text"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="Yeni konu başlığı"
            className="forum-input-inline"
          />
          <button type="submit" disabled={submitting} className="forum-btn">
            <FiPlusCircle className="inline-block w-4 h-4 mr-1 align-middle" />
            {submitting ? 'Açılıyor...' : 'Konu aç'}
          </button>
        </form>

        <div className="forum-search-wrap">
          <FiSearch className="inline-block w-4 h-4 mr-2 text-gray-400 align-middle" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konularda ara..."
            aria-label="Konularda ara"
          />
        </div>

        {loading ? (
          <p className="forum-muted">Yükleniyor...</p>
        ) : filteredTopics.length === 0 ? (
          <p className="forum-muted">
            {searchQuery.trim() ? 'Aramanıza uygun konu yok.' : 'Henüz konu yok. Yukarıdan yeni konu açabilirsiniz.'}
          </p>
        ) : (
          <>
            <table className="forum-table">
              <thead>
                <tr>
                  <th>Konu</th>
                  <th className="forum-th-count">Mesaj</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <Link to={`/forum/konu/${t.slug || t._id}`} className="forum-link">
                        {t.title}
                      </Link>
                    </td>
                    <td className="forum-td-count">{t.postCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="forum-topic-cards">
              {filteredTopics.map((t) => (
                <Link
                  key={t._id}
                  to={`/forum/konu/${t.slug || t._id}`}
                  className="forum-topic-card"
                >
                  <div className="forum-topic-card-title">{t.title}</div>
                  <div className="forum-topic-card-meta">{t.postCount ?? 0} mesaj</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
