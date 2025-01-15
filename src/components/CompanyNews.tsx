import { useCompanyNews } from "../hooks/useCompanyNews";
import { getOneYearAgoYYYYMMDD, getTodayYYYYMMDD } from "../utils/Utils";

interface CompanyNewsProps {
  symbol: string;
}

/**
 * Component that displays the latest news for a given company.
 **/
const CompanyNews: React.FC<CompanyNewsProps> = ({ symbol }) => {
  const from = getOneYearAgoYYYYMMDD(); // Start date (YYYY-MM-DD)
  const to = getTodayYYYYMMDD(); // End date (YYYY-MM-DD)

  const { news, loading, error } = useCompanyNews(symbol, from, to);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={"company-news"}>
      <h2>Latest News for {symbol}</h2>
      {news.length > 0 ? (
        <ul>
          {news.map((item) => (
            <li key={item.id}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <h3>{item.headline}</h3>
              </a>
              <p>{item.summary}</p>
              <p className="small-font">
                {new Date(item.datetime * 1000).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available for the last year.</p>
      )}
    </div>
  );
};

export default CompanyNews;
