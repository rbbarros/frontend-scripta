import RankingView from "../../../components/RankingView";
import { useAuthGuard } from "../../../shared/useAuthGuard";

export default function Ranking() {
  useAuthGuard();
  return <RankingView accentColor="emerald" />;
}
