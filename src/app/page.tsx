import { site } from "@/config/site";
import { PageEnhancements, DonateButton } from "@/components/actions";
import { Header, Hero, MyWhy, VideoSection, Share, Footer } from "@/components/sections";
export default function Home() {
  return <PageEnhancements><div id="top"/><a className="skip-link" href="#main">{site.labels.skip}</a><Header/><main id="main"><Hero/><VideoSection/><MyWhy/><Share/></main><Footer/><div className="mobile-donate"><DonateButton/></div></PageEnhancements>;
}
