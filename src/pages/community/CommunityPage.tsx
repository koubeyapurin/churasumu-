import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mockCommunityPosts,
  mockCoupons,
  mockLocalInfos,
  mockUsers,
} from '../../data/mockData';
import type { CommunityPost, Coupon, LocalInfo, User } from '../../types';
import { useApp } from '../../context/AppContext';
import styles from './CommunityPage.module.css';

type Tab = 'feed' | 'matching' | 'spots' | 'coupons';
type SortOption = 'newest' | 'popular';
type FilterOption = 'all' | 'qa' | 'info' | 'review';

const categoryIcon = {
  restaurant: '🍽️',
  event: '🎉',
  coworking: '💻',
  shop: '🛍️',
} as const;

export default function CommunityPage() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useApp();
  const [tab, setTab] = useState<Tab>('feed');
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<CommunityPost['type']>('qa');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'zh' ? 'zh-CN' : 'en-US';

  const postTypeBadge = {
    qa: { label: 'Q&A', cls: 'badge-blue' },
    review: { label: t('community.review'), cls: 'badge-green' },
    info: { label: t('community.info'), cls: 'badge-orange' },
  } as const;

  const localizedPosts = useMemo(
    () =>
      posts.map((post) => {
        if (!post.id.startsWith('cp')) return post;

        return {
          ...post,
          title: t(`communityData.posts.${post.id}.title`, { defaultValue: post.title }),
          content: t(`communityData.posts.${post.id}.content`, { defaultValue: post.content }),
          tags: post.tags.map((tag, index) =>
            t(`communityData.posts.${post.id}.tags.${index}`, { defaultValue: tag }),
          ),
          replies: post.replies?.map((reply) => ({
            ...reply,
            content: t(`communityData.posts.${post.id}.replies.${reply.id}`, {
              defaultValue: reply.content,
            }),
          })),
        };
      }),
    [posts, t],
  );

  const localizedLocalInfos = useMemo(
    () =>
      mockLocalInfos.map((info: LocalInfo) => ({
        ...info,
        name: t(`communityData.localInfos.${info.id}.name`, { defaultValue: info.name }),
        description: t(`communityData.localInfos.${info.id}.description`, {
          defaultValue: info.description,
        }),
        address: t(`communityData.localInfos.${info.id}.address`, { defaultValue: info.address }),
        tags: info.tags.map((tag, index) =>
          t(`communityData.localInfos.${info.id}.tags.${index}`, { defaultValue: tag }),
        ),
      })),
    [t],
  );

  const localizedCoupons = useMemo(
    () =>
      mockCoupons.map((coupon: Coupon) => ({
        ...coupon,
        shopName: t(`communityData.coupons.${coupon.id}.shopName`, {
          defaultValue: coupon.shopName,
        }),
        description: t(`communityData.coupons.${coupon.id}.description`, {
          defaultValue: coupon.description,
        }),
        discount: t(`communityData.coupons.${coupon.id}.discount`, {
          defaultValue: coupon.discount,
        }),
      })),
    [t],
  );

  const localizedUsers = useMemo(
    () =>
      mockUsers.map((user: User) => ({
        ...user,
        name: t(`communityData.users.${user.id}.name`, { defaultValue: user.name }),
        bio: t(`communityData.users.${user.id}.bio`, { defaultValue: user.bio ?? '' }),
      })),
    [t],
  );

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setPosts((prev) => [
      {
        id: `cp${Date.now()}`,
        userId: currentUser.id,
        type: newType,
        title: newTitle,
        content: newContent,
        tags: [],
        likes: 0,
        createdAt: new Date().toISOString(),
        replies: [],
      },
      ...prev,
    ]);

    setNewTitle('');
    setNewContent('');
    setShowForm(false);
  };

  const handleLike = (id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
  };

  const getUserName = (id: string) =>
    localizedUsers.find((user) => user.id === id)?.name ?? t('community.unknownUser');

  const getFilteredPosts = () => {
    let filtered = localizedPosts;

    if (filterBy !== 'all') {
      filtered = localizedPosts.filter((post) => post.type === filterBy);
    }

    if (sortBy === 'newest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes);
    }

    return filtered;
  };

  const getMatchedUsers = () => {
    if (!currentUser) return [];
    return localizedUsers.filter((user) => user.id !== currentUser.id).slice(0, 5);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'feed', label: t('community.posts'), icon: '📝' },
    { key: 'matching', label: t('community.matching'), icon: '🤝' },
    { key: 'spots', label: t('community.information'), icon: '📍' },
    { key: 'coupons', label: t('community.coupons'), icon: '🎫' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('community.title')}</h1>
      </div>

      <div className={styles.tabs}>
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`${styles.tab} ${tab === item.key ? styles.tabActive : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {tab === 'feed' && (
        <>
          <div className={styles.controls}>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? t('common.cancel') : `+ ${t('community.createPost')}`}
            </button>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className={styles.filterSelect}
            >
              <option value="all">{t('community.allTypes')}</option>
              <option value="qa">Q&A</option>
              <option value="info">{t('community.info')}</option>
              <option value="review">{t('community.review')}</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="newest">{t('community.sortNewest')}</option>
              <option value="popular">{t('community.sortPopular')}</option>
            </select>
          </div>

          {showForm && (
            <form onSubmit={handlePost} className={styles.postForm}>
              <div className="form-group">
                <label>{t('community.postType')}</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CommunityPost['type'])}
                >
                  <option value="qa">Q&A</option>
                  <option value="info">{t('community.info')}</option>
                  <option value="review">{t('community.review')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('community.postTitle')}</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder={t('community.postTitlePlaceholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('stay.description')}</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  placeholder={t('community.postContentPlaceholder')}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {t('common.submit')}
              </button>
            </form>
          )}

          <div className={styles.postList}>
            {getFilteredPosts().map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={`badge ${postTypeBadge[post.type].cls}`}>
                    {postTypeBadge[post.type].label}
                  </span>
                  <span className={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString(locale)}
                  </span>
                </div>
                <h4 className={styles.postTitle}>{post.title}</h4>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postFooter}>
                  <span className={styles.postAuthor}>
                    {t('community.authorBy', { name: getUserName(post.userId) })}
                  </span>
                  <div className={styles.postActions}>
                    <button className={styles.likeBtn} onClick={() => handleLike(post.id)}>
                      👍 {post.likes}
                    </button>
                    {post.replies && post.replies.length > 0 && (
                      <span className={styles.replyCount}>💬 {post.replies.length}</span>
                    )}
                  </div>
                </div>
                {post.tags.length > 0 && (
                  <div className={styles.spotTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.spotTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.replies && post.replies.length > 0 && (
                  <div className={styles.replyList}>
                    {post.replies.map((reply) => (
                      <div key={reply.id} className={styles.reply}>
                        <span className={styles.replyAuthor}>{getUserName(reply.userId)}</span>
                        <p className={styles.replyContent}>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'matching' && (
        <div className={styles.matchingContainer}>
          <h3 style={{ marginBottom: 16 }}>{t('community.matching')}</h3>
          <div className={styles.matchingList}>
            {getMatchedUsers().map((user) => (
              <div key={user.id} className={styles.matchCard}>
                <div className={styles.matchHeader}>
                  <div className={styles.matchAvatar}>{user.name.charAt(0)}</div>
                  <div className={styles.matchInfo}>
                    <h4 className={styles.matchName}>{user.name}</h4>
                    <p className={styles.matchStatus}>{user.email}</p>
                  </div>
                </div>
                <div className={styles.matchSummary}>
                  <p>{t(`communityData.users.${user.id}.summary.duration`)}</p>
                  <p>{t(`communityData.users.${user.id}.summary.purpose`)}</p>
                  {user.bio && <p>{user.bio}</p>}
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  {t('community.share')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'spots' && (
        <div className={styles.spotList}>
          {localizedLocalInfos.map((info) => (
            <div key={info.id} className={styles.spotCard}>
              <div className={styles.spotHeader}>
                <span className={styles.spotIcon}>{categoryIcon[info.category]}</span>
                <div className={styles.spotInfo}>
                  <h4 className={styles.spotName}>{info.name}</h4>
                  <p className={styles.spotAddress}>📍 {info.address}</p>
                </div>
                {info.rating && <span className={styles.spotRating}>★ {info.rating}</span>}
              </div>
              <p className={styles.spotDesc}>{info.description}</p>
              <div className={styles.spotTags}>
                {info.tags.map((tag) => (
                  <span key={tag} className={styles.spotTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'coupons' && (
        <div className={styles.couponList}>
          {localizedCoupons.map((coupon) => (
            <div key={coupon.id} className={styles.couponCard}>
              <div className={styles.couponLeft}>
                <span className={styles.couponIcon}>🎫</span>
              </div>
              <div className={styles.couponInfo}>
                <h4 className={styles.couponShop}>{coupon.shopName}</h4>
                <p className={styles.couponDesc}>{coupon.description}</p>
                <div className={styles.couponMeta}>
                  <span className={styles.couponDiscount}>{coupon.discount}</span>
                  <span className={styles.couponExpiry}>
                    {t('community.expires', { date: coupon.validUntil })}
                  </span>
                </div>
              </div>
              <div className={styles.couponCode}>
                <span className={styles.codeLabel}>{t('community.code')}</span>
                <code className={styles.code}>{coupon.code}</code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
