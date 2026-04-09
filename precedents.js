// Vercel Serverless Function: 법제처 API 프록시
// 브라우저 CORS 우회용 중계 서버

const OC = process.env.LAW_OC || "boy806";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { query, id } = req.query;

  try {
    let url;
    if (id) {
      url = `http://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=prec&ID=${encodeURIComponent(id)}&type=XML`;
    } else if (query) {
      url = `http://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=prec&type=XML&query=${encodeURIComponent(query)}&display=20&search=2`;
    } else {
      return res.status(400).json({ error: "query 또는 id 파라미터 필요" });
    }

    const response = await fetch(url);
    const xmlText = await response.text();
    const parsed = parseXML(xmlText, !!id);
    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function parseXML(xml, isDetail) {
  const getTag = (str, tag) => {
    const m = str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
    if (!m) return "";
    return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
  };

  const getAllTags = (str, tag) => {
    const results = [];
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
    let m;
    while ((m = regex.exec(str)) !== null) {
      results.push(m[1]);
    }
    return results;
  };

  if (isDetail) {
    return {
      caseNo: getTag(xml, "사건번호"),
      caseName: getTag(xml, "사건명"),
      court: getTag(xml, "법원명"),
      date: getTag(xml, "선고일자"),
      summary: getTag(xml, "판결요지"),
      holding: getTag(xml, "판시사항"),
      fullText: getTag(xml, "판례내용").replace(/<[^>]+>/g, "").substring(0, 3000),
    };
  } else {
    const totalCnt = parseInt(getTag(xml, "totalCnt") || "0");
    const items = getAllTags(xml, "prec").map((item) => ({
      id: getTag(item, "판례일련번호"),
      caseName: getTag(item, "사건명"),
      caseNo: getTag(item, "사건번호"),
      date: getTag(item, "선고일자"),
      court: getTag(item, "법원명"),
      caseType: getTag(item, "사건종류명"),
    }));
    return { totalCnt, items };
  }
}
