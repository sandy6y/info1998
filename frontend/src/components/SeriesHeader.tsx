// ====== Header for blind box series =====

import { HeaderSimple } from "../components/Header"; // reuse your existing header component
import {SPATHS} from "../constants/SeriesNavigation"

export default function SeriesHeader() {
    const seriesLinks = SPATHS.map((item) => ({
    ...item,
    link: `/library/${item.link}`,
  }));

  return <HeaderSimple links={seriesLinks} />;
}