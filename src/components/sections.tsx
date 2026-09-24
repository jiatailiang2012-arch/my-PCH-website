import { HeroMedia } from "./hero-media";
import { ArrowUpRight, LockKeyhole, Sun, ArrowUp, KeyRound, Play } from "lucide-react";
import { site } from "@/config/site";
import { DonateButton, OfficialLink, ShareButtons, VideoPlayer } from "./actions";

export function SecurityNote() {
  return <p className="security-note"><LockKeyhole size={13} aria-hidden="true"/>{site.labels.secure}</p>;
}
export function Header() {
  return <header className="site-header"><div className="container header-inner">
    <a className="brand" href="#top" aria-label={`${site.name} — ${site.labels.backToTop}`}>
      <span className="brand-symbol"><Sun size={23} strokeWidth={1.5}/></span>
      <span>{site.name}<small>{site.memberLabel}</small></span>
    </a>
    <nav aria-label="Main navigation">{site.navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <DonateButton compact />
  </div></header>;
}
export function Hero() {
  const f = site.fundraising;
  const gift = site.thankYouGift;
  const goal = new Intl.NumberFormat(f.locale, {style:"currency", currency:f.currency, maximumFractionDigits:0}).format(f.goal);
  return <section className="hero compact-hero" aria-labelledby="hero-heading">
    <figure className="hero-image hero-video-frame"><HeroMedia /></figure>
    <div id="progress" className="container campaign-panel">
      <div className="campaign-intro">
        <p className="eyebrow">{site.independentLabel}</p>
        <h1 id="hero-heading">{site.hero.headline}</h1>
        <p className="campaign-mission">{site.hero.mission}</p>
        <a className="campaign-watch" href="#my-message"><Play size={15} aria-hidden="true"/>{site.hero.watchMessage}</a>
      </div>
      <div className="campaign-action">
        <p className="campaign-goal"><span>{f.goalPrompt}</span><strong>{goal}</strong><span>{f.goalLabel}</span></p>
        <DonateButton/><SecurityNote/>
        <a className="text-link latest-progress" href={site.donationUrl} target="_blank" rel="noopener noreferrer">
          {f.latestProgress}<ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> ({site.labels.external})</span>
        </a>
      </div>
      <aside id="a-little-thank-you" className="campaign-gift" aria-labelledby="handmade-heading">
        <span className="campaign-gift-icon"><KeyRound size={30} strokeWidth={1.5} aria-hidden="true"/></span>
        <div><div className="campaign-gift-title"><h2 id="handmade-heading">{gift.title}</h2><span>{gift.status}</span></div>
          <p>{gift.description} <span>{gift.details}</span></p>
        </div>
      </aside>
    </div>
  </section>;
}
export function VideoSection() {
  return <section id="my-message" className="section compact-message" aria-labelledby="video-heading">
    <div className="container message-container">
      <div className="message-heading"><h2 id="video-heading">{site.video.title}</h2><span>{site.video.duration}</span></div>
      <VideoPlayer/>
    </div>
  </section>;
}
export function MyWhy() {
  return <section id="my-why" className="section compact-story" aria-labelledby="why-heading">
    <div className="container story-layout">
      <div><p className="eyebrow">{site.why.eyebrow}</p><h2 id="why-heading">{site.why.title}</h2></div>
      <div className="story-copy">
        {site.why.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div id="impact" className="story-council">
          <p>{site.impact.description}</p>
          <a className="text-link" href={site.impact.learnMoreUrl} target="_blank" rel="noopener noreferrer">{site.impact.learnMore}<ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> ({site.labels.external})</span></a>
        </div>
      </div>
    </div>
  </section>;
}
export function Share() {
  return <section id="share" className="section compact-share" aria-labelledby="share-heading">
    <div className={`container share-layout${site.share.qrImage ? "" : " share-without-qr"}`}>
      <div><h2 id="share-heading">{site.share.title}</h2><p className="share-description">{site.share.description}</p></div>
      <ShareButtons/>
      {site.share.qrImage && <div className="qr-card"><img src={site.share.qrImage} alt={site.share.qrAlt} width="144" height="144" loading="lazy"/><p>{site.share.qrCaption}</p></div>}
    </div>
  </section>;
}
export function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div className="footer-brand"><Sun size={30} strokeWidth={1.3}/><p>{site.footer.line}</p></div><OfficialLink/></div>
    <div className="footer-disclosures"><p>{site.footer.disclosure} {site.footer.independence}</p></div>
    <div className="footer-bottom"><span>{site.footer.copyright}</span><a href="#top">{site.labels.backToTop}<ArrowUp size={14}/></a></div>
  </div></footer>;
}
