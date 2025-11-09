import { HeaderSimple } from "../components/Header"; // reuse your existing header component
import {SPATHS} from "../constants/SeriesNavigation"

export default function SeiresHeader() {
    const seriesLinks = SPATHS.map((item) => ({
    ...item,
    link: `/profile/${item.link}`,
  }));

  return <HeaderSimple links={seriesLinks} />;
}