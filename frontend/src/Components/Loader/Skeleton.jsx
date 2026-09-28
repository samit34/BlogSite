import "./Skeleton.css";

export function Sk({ className = "", style }) {
  return <span className={`sk ${className}`.trim()} style={style} aria-hidden />;
}

export function StoryListSkeleton({ count = 4 }) {
  return (
    <div className="sk-archive" role="status" aria-busy="true" aria-label="Loading stories">
      {Array.from({ length: count }, (_, i) => (
        <div className="sk-story" key={i}>
          <div className="sk-story__media">
            <Sk className="sk--fill" />
          </div>
          <div className="sk-story__body">
            <Sk className="sk--line sk--w-24" />
            <Sk className="sk--line sk--title" />
            <Sk className="sk--line sk--w-56" />
            <Sk className="sk--line sk--w-40" />
            <div className="sk-story__tools">
              <Sk className="sk--pill" />
              <Sk className="sk--circle" />
              <Sk className="sk--line sk--w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="sk-account" role="status" aria-busy="true" aria-label="Loading account">
      <div className="sk-account__banner">
        <Sk className="sk--avatar" />
        <div className="sk-account__banner-copy">
          <Sk className="sk--line sk--w-32" />
          <Sk className="sk--line sk--title" />
          <Sk className="sk--line sk--w-40" />
          <Sk className="sk--pill sk--pill-lg" />
        </div>
      </div>
      <div className="sk-account__grid">
        {Array.from({ length: 3 }, (_, i) => (
          <div className="sk-card" key={i}>
            <div className="sk-card__media">
              <Sk className="sk--fill" />
            </div>
            <div className="sk-card__body">
              <Sk className="sk--line sk--w-24" />
              <Sk className="sk--line sk--w-80" />
              <Sk className="sk--pill sk--pill-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="sk-article" role="status" aria-busy="true" aria-label="Loading article">
      <Sk className="sk--line sk--w-24" />
      <Sk className="sk--line sk--display" />
      <Sk className="sk--line sk--w-72" />
      <Sk className="sk--line sk--w-40" />
      <div className="sk-article__figure">
        <Sk className="sk--fill" />
      </div>
      <Sk className="sk--line" />
      <Sk className="sk--line" />
      <Sk className="sk--line sk--w-80" />
      <Sk className="sk--line" />
      <Sk className="sk--line sk--w-56" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="sk-home" role="status" aria-busy="true" aria-label="Loading magazine">
      <div className="sk-home__featured">
        <Sk className="sk--line sk--w-24" />
        <Sk className="sk--line sk--title" />
        <div className="sk-home__hero-media">
          <Sk className="sk--fill" />
        </div>
      </div>
      <div className="sk-home__latest">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="sk-latest-row" key={i}>
            <div className="sk-latest-row__thumb">
              <Sk className="sk--fill" />
            </div>
            <div className="sk-latest-row__copy">
              <Sk className="sk--line sk--w-32" />
              <Sk className="sk--line sk--w-80" />
              <Sk className="sk--line sk--w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="sk-auth" role="status" aria-busy="true" aria-label="Loading">
      <div className="sk-auth__bar">
        <Sk className="sk--line sk--w-24" />
        <Sk className="sk--line sk--title" />
        <Sk className="sk--line sk--w-32" />
      </div>
      <div className="sk-auth__body">
        <Sk className="sk--line sk--w-24" />
        <Sk className="sk--line sk--display" />
        <Sk className="sk--line sk--w-56" />
        <div className="sk-auth__block">
          <Sk className="sk--fill" />
        </div>
        <StoryListSkeleton count={3} />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="sk-form" role="status" aria-busy="true" aria-label="Loading form">
      <Sk className="sk--line sk--w-24" />
      <Sk className="sk--line sk--title" />
      <Sk className="sk--line sk--w-56" />
      <div className="sk-form__field">
        <Sk className="sk--fill" />
      </div>
      <Sk className="sk--line sk--field" />
      <Sk className="sk--line sk--field" />
      <Sk className="sk--line sk--area" />
      <Sk className="sk--pill sk--pill-lg" />
    </div>
  );
}
