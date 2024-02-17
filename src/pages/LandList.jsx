import React, { useState, useEffect } from 'react'
import { Box, IconButton, Paper, TableContainer, Table, TextField, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, tableCellClasses, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import PropTypes from 'prop-types';
import Land from '../components/Land';
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import * as XLSX  from 'xlsx';
// import NewMap from '../components/NewMap';
// import { KakaoMap, Marker } from 'react-kakao-maps';



// 1. Define subFunction ================================================
// Table Pagination Function Start -----------------------------------------------------
function TablePaginationActions(props) {
  const theme = useTheme();  
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// Table style ----------------------------------------------------
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));




// https://new.land.naver.com/api/regions/list?cortarNo=1165000000  서초구 동이름, 동코드 알아오기


function LandList() {

  const keysInfo = {atclNo: '매물번호', cortarNo: '동이름', atclNm: '매물', atclStatCd: '몰라요1', rletTpCd: '물건 Code', uprRletTpCd: '몰라요2', rletTpNm: '물건 종류', tradTpCd: '거래 Code', tradTpNm: '거래 종류', vrfcTpCd: '몰라요3', flrInfo: '층 ', prc: '매매(전세)가(만원)', rentPrc: '월세(만원)', hanPrc: '매매(전세)가', spc1:'계약면적(㎡)', spc2: '전용면적(㎡)', direction: '향', atclCfmYmd: '매물확인날짜', repImgUr: '이미지URL', repImgTpCd: '몰라요4', repImgThumb: '몰라요5', lat: '위도', lng: '경도', atclFetrDesc: '매물특징', tagList: '상세설명', bildNm: '동', minute: '몰라요6', sameAddrCnt: '몰라요7', sameAddrDirectCnt: '몰라요8', cpid: '정보제공업체ID', cpNm: '정보제공업체', cpCnt: '정보제공업체 ', rltrNm: '중개사', directTradYn: '몰라요9', minMviFee: '몰라요10', maxMviFee: '몰라요11', etRoomCnt: '몰라요12', tradePriceHan: '몰라요13', tradeRentPrice: '몰라요14', tradeCheckedByOwner: '몰라요15', cpLinkVO: '정보제공업정보', dtlAddrYn: '몰라요16', dtlAddr: '몰라요17'}

  // Table Pagination Start ----------------------------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ landList, setLandList ] = useState([])
  const [ findSi, setFindSi ] = useState()
  const [ findInputSi, setFindInputSi ] = useState()
  const [ findGoo, setFindGoo ] = useState()
  const [ findInputGoo, setFindInputGoo ] = useState()
  const [ findDong, setFindDong ] = useState()
  const [ findInputDong, setFindInputDong ] = useState()
  const [ findType, setFindType ] = useState()
  const [ findInputType, setFindInputType ] = useState()
  const [ findTradeType, setFindTradeType ] = useState()
  const [ findInputTradeType, setFindInputTradeType ] = useState()
  const [ siNameList, setSiNameList ] = useState()
  const [ siCodeList, setSiCodeList ] = useState([])
  const [ gooNameList, setGooNameList ] = useState()
  const [ gooCodeList, setGooCodeList ] = useState([])
  const [ dongNameList, setDongNameList ] = useState()
  const [ dongCodeList, setDongCodeList ] = useState([])
  const [ dongLatList, setDongLatList ] = useState([])
  const [ dongLonList, setDongLonList ] = useState([])
  const [ typeNameList, setTypeNameList ] = useState()
  const [ tradeTypeNameList, setTradeTypeNameList ] = useState()
  const [ sortNo, setSortNo ] = useState(0)
  const [ isMapOpen, setIsMapOpen ] = useState(false)
  const [ mapOption, setMapOption ] = useState(false) 


  // 3-2. table pagination subfunction --------------------------------------- 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 3-3 table pagination subfunction ----------------------------------------- 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };  


  useEffect(()=>{

    const fetchAllSiList = async () => {
      let temp = []
      let temp1 = []  
      try {
        const res = await axios.get("https://new.land.naver.com/api/regions/list?cortarNo=0000000000")
        console.log(res.data.regionList)
        res.data.regionList.forEach(ele => {
          temp.push(ele.cortarName)
          temp1.push(ele.cortarNo)
        });
        setSiNameList(temp)
        setSiCodeList(temp1)
      } catch(err) {
        console.log(err)
      }  
    }  

    fetchAllSiList()

  }, [])



  useEffect(()=>{

    const fetchAllGooList = async () => {
      let temp = []
      let temp1 = []
      let codeIndex
      if(siNameList) {
        codeIndex = siNameList.indexOf(findSi)
      }
      try {
        let res = []
        res = await axios.get(`https://new.land.naver.com/api/regions/list?cortarNo=${siCodeList[codeIndex]}`)
        console.log(res.data.regionList)        
        if (res) {
          res.data.regionList.forEach(ele => {
            temp.push(ele.cortarName)
            temp1.push(ele.cortarNo)
          });
        }  
        setGooNameList(temp)
        setGooCodeList(temp1)
      } catch(err) {
        console.log(err)
      }  
    }
  
    fetchAllGooList()

  }, [findSi, siNameList, siCodeList])


useEffect(()=>{

  const fetchAllDongList = async () => {
    let temp = []
    let temp1 = []
    let temp2 = []
    let temp3 = []
    let codeIndex = ''
    if(gooNameList) {
      codeIndex = gooNameList.indexOf(findGoo)
    }
    try {
      let res = []
      res = await axios.get(`https://new.land.naver.com/api/regions/list?cortarNo=${gooCodeList[codeIndex]}`)
      console.log(res.data.regionList)      
      if(res) {
        res.data.regionList.forEach(ele => {
          temp.push(ele.cortarName)
          temp1.push(ele.cortarNo)
          temp2.push(ele.centerLat)
          temp3.push(ele.centerLon)
        });
      }    
      setDongNameList(temp)
      setDongCodeList(temp1)
      setDongLatList(temp2)
      setDongLonList(temp3)
    } catch(err) {
      console.log(err)
    }
    setTypeNameList(['아파트', '아파트분양권', '재건축', '오피스텔', '오피스텔분양권', '재개발', '빌라/연립', '단독/다가구', '전원주택', '상가주택', '한옥주택', '상가', '사무실', '지식산업센터', '공장/창고', '건물', '토지'])
    setTradeTypeNameList(['매매', '전세', '월세'])
  }

  fetchAllDongList()

}, [findGoo, gooNameList, gooCodeList])


const mapOptionOnOff = () => {
  setMapOption(!mapOption)
  mapView()
}



const mapView = () => {
  setIsMapOpen(true)

  // window.open('https://map.kakao.com/', '_blank')

  let mapCenLat = dongLatList[dongNameList.indexOf(findDong)]
  let mapCenLon = dongLonList[dongNameList.indexOf(findDong)]  

  window.kakao.maps.load(() => {

    const mapContainer = document.getElementById('myMap');
    const options = { center: new window.kakao.maps.LatLng(mapCenLat, mapCenLon), // 지도 초기 중심 좌표
                      level: 3, // 지도 확대 레벨
                    };
    const map = new window.kakao.maps.Map(mapContainer, options);

    // 마커 추가 예시
    landList.map((land, index) => (
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(land.lat, land.lng),
          title: land.atclNo,
        }).setMap(map)
    ))


    landList.map((land, index)=> (

      new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(land.lat, land.lng),
        content: `<div style="background-color:yellow; opacity: 0.8; text-align:center; border-radius: 7px; width: 35px; height: 19px";> ${index+1} </div>`   
      }).setMap(map)

    ))

    if (mapOption) {map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT)}
    else {map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT)}

})

}


useEffect(() => {
  const mapScript = document.createElement('script');

  mapScript.async = true;
  mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=31f6e157c3e7833d28415e28f691fab5&autoload=false`;

  document.head.appendChild(mapScript);
}, []);


// useEffect(() => {
//   // 카카오지도 API 키를 사용하여 초기화합니다.
//   window.kakao.maps.load(() => {
//     const mapContainer = document.getElementById('myMap');
//     const options = {
//       center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 지도 초기 중심 좌표
//       level: 3, // 지도 확대 레벨
//     };
//     const map = new window.kakao.maps.Map(mapContainer, options);

//     // 마커 추가 예시
//     const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
//     const marker = new window.kakao.maps.Marker({
//       position: markerPosition,
//     });
//     marker.setMap(map);
//   });
// }, []);


const priceSort = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => Number(a.prc) - Number(b.prc));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => Number(b.prc) - Number(a.prc));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort2 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => Number(a.rentPrc) - Number(b.rentPrc));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => Number(b.rentPrc) - Number(a.rentPrc));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort3 = () => {
  let temp = []
  if (sortNo === 0) {
    if(findTradeType === '월세') {
    temp = [...landList].sort((a, b) => (Number(a.rentPrc)/Number(a.spc2)) - (Number(b.rentPrc)/Number(b.spc2)));
    } else {
      temp = [...landList].sort((a, b) => (Number(a.prc)/Number(a.spc2)) - (Number(b.prc)/Number(b.spc2)));
    }
    setSortNo(1)
  } else {
    if(findTradeType === '월세') {
    temp = [...landList].sort((a, b) => (Number(b.rentPrc)/Number(b.spc2)) - (Number(a.rentPrc)/Number(a.spc2)));
    } else {
      temp = [...landList].sort((a, b) => (Number(b.prc)/Number(b.spc2)) - (Number(a.prc)/Number(a.spc2)));
    }
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}

const priceSort4 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => Number(a.spc1) - Number(b.spc1));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => Number(b.spc1) - Number(a.spc1));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort5 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => Number(a.spc2) - Number(b.spc2));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => Number(b.spc2) - Number(a.spc2));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort6 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => (Number(a.spc2)/Number(a.spc1)) - (Number(b.spc2)/Number(b.spc1)));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => (Number(b.spc2)/Number(b.spc1)) - (Number(a.spc2)/Number(a.spc1)));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort7 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => a.atclNm.localeCompare(b.atclNm, 'ko-KR'));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => b.atclNm.localeCompare(a.atclNm, 'ko-KR'));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const priceSort8 = () => {
  let temp = []
  if (sortNo === 0) {
    temp = [...landList].sort((a, b) => Number(a.atclNo) - Number(b.atclNo));
    setSortNo(1)
  } else {
    temp = [...landList].sort((a, b) => Number(b.atclNo) - Number(a.atclNo));
    setSortNo(0)
  }  
  setLandList(temp)
  setPage(0);
}


const handleClickFind = async () => {

  let temp = []
  let type = ''
  let tradeType = ''
  let dongCode = dongCodeList[dongNameList.indexOf(findDong)]
  if (findType === '아파트') {
    type = 'APT'
  }
  if (findType === '아파트분양권') {
    type = 'ABYG'
  }
  if (findType === '재건축') {
    type = 'JGC'
  }
  if (findType === '오피스텔') {
    type = 'OPST'
  }
  if (findType === '오피스텔분양권') {
    type = 'OBYG'
  }
  if (findType === '재개발') {
    type = 'JGB'
  }
  if (findType === '빌라/연립') {
    type = 'VL'
  }
  if (findType === '단독/다가구') {
    type = 'DDDGG'
  }
  if (findType === '전원주택') {
    type = 'JWJT'
  }
  if (findType === '상가주택') {
    type = 'SGJT'
  }
  if (findType === '한옥주택') {
    type = 'HOJT'
  }
  if (findType === '상가') {
    type = 'SG'
  }
  if (findType === '사무실') {
    type = 'SMS'
  }
  if (findType === '지식산업센터') {
    type = 'APTHGJ'
  }
  if (findType === '공장/창고') {
    type = 'GJCG'
  }
  if (findType === '건물') {
    type = 'GM'
  }
  if (findType === '토지') {
    type = 'TJ'
  }
  if (findTradeType === '매매') {
    tradeType = 'A1'
  } 
  if (findTradeType === '전세') {
    tradeType = 'B1'
  }
  if (findTradeType === '월세') {
    tradeType = 'B2'
  }

    try{
      // const res1 = await axios.get("https://fin.land.naver.com/articles/2401460139")
      const res1 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=1`)
      const res2 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=2`)
      const res3 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=3`)
      const res4 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=4`)
      const res5 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      const res6 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      const res7 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      // const res8 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      // const res9 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      // const res10 = await axios.get(`https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=${type}&tradTpCd=${tradeType}&cortarNo=${dongCode}&sort=rank&page=5`)
      
      console.log(res1.data)
      temp = [...temp, ...res1.data.body]
      temp = [...temp, ...res2.data.body]
      temp = [...temp, ...res3.data.body]
      temp = [...temp, ...res4.data.body]
      temp = [...temp, ...res5.data.body]
      temp = [...temp, ...res6.data.body]
      temp = [...temp, ...res7.data.body]
      // temp = [...temp, ...res8.data.body]
      // temp = [...temp, ...res9.data.body]
      // temp = [...temp, ...res10.data.body]
      console.log(temp)      
      setLandList(temp)
    }catch(err){
      console.log(err)
    }
}


const handleClickExport = () => {

  let copyList = JSON.parse(JSON.stringify(landList));
  let copyList2 = JSON.parse(JSON.stringify(landList));

  let firstItem = copyList[0]

  const keys = Object.keys(firstItem)

  keys.forEach(ele => {
    firstItem[ele] = keysInfo[ele]
  });

  copyList2.unshift(firstItem)

  console.log(keys)

  let copyList3 = []

  copyList2.forEach(ele => {
    let temp = {}
    keys.forEach((k, i) => {      
      temp[k] = ele[k]
      if(i===10) {
        temp[k] = (ele[k]).split('/')[0]
        temp['총층수'] = (ele[k]).substring((ele[k]).indexOf('/') + 1)
      }
  })
  copyList3.push(temp)  
})

  let wb = XLSX.utils.book_new()
  let ws = XLSX.utils.json_to_sheet(copyList3)
  XLSX.utils.book_append_sheet(wb, ws, 'MySheet1')
  XLSX.writeFile(wb, 'MyExcle.xlsx')
}


  return (
    <Container maxWidth='false' sx={{m: 0}}>

    <div style={{ marginTop:10,  width: 1100, display: 'flex',  justifyContent: 'space-between', alignItems: 'flex-end' }}>
    
    <Autocomplete size="small"
      value={findSi}
      onChange={(event, newValue) => {
        setFindSi(newValue);
      }}
      InputValue={findInputSi}
      onInputChange={(event, newInputValue) => {
        setFindInputSi(newInputValue);
      }}
      id="controllable-states-demo2"
      options={siNameList}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="시이름" />}
    />
    
    <Autocomplete size="small"
      value={findGoo}
      onChange={(event, newValue) => {
        setFindGoo(newValue);
      }}
      InputValue={findInputGoo}
      onInputChange={(event, newInputValue) => {
        setFindInputGoo(newInputValue);
      }}
      id="controllable-states-demo2"
      options={gooNameList}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="구이름" />}
    />

    <Autocomplete size="small"
      value={findDong}
      onChange={(event, newValue) => {
        setFindDong(newValue);
      }}
      InputValue={findInputDong}
      onInputChange={(event, newInputValue) => {
        setFindInputDong(newInputValue);
      }}
      id="controllable-states-demo2"
      options={dongNameList}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="동이름" />}
    />

    <Autocomplete size="small"
      value={findType}
      onChange={(event, newValue) => {
        setFindType(newValue);
      }}
      InputValue={findInputType}
      onInputChange={(event, newInputValue) => {
        setFindInputType(newInputValue);
      }}
      id="controllable-states-demo2"
      options={typeNameList}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="부동산 종류" />}
    />

    <Autocomplete size="small"
      value={findTradeType}
      onChange={(event, newValue) => {
        setFindTradeType(newValue);
      }}
      InputValue={findInputTradeType}
      onInputChange={(event, newInputValue) => {
        setFindInputTradeType(newInputValue);
      }}
      id="controllable-states-demo2"
      options={tradeTypeNameList}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="거래 종류" />}
    />

    <Button sx={{height:'40px', padding: 1}} variant='contained' color='primary' onClick={handleClickFind}>
      검색
    </Button>

    <Button sx={{height:'40px', padding: 1}} variant='contained' color='primary' onClick={handleClickExport}>
      Export
    </Button>

    <Button sx={{height:'40px', padding: 1}} variant='contained' color='primary' onClick={mapView}>
      카카오지도보기
    </Button>

    </div>


    <Paper style={{marginTop: 10, marginBottom: 10, marginLeft: 0, marginRight: 0}} elevation={3}>
    <TableContainer>
      <Table stickyHeader size='small' aria-label="sticky table">        
        <TableHead>
          <TableRow>
            <StyledTableCell padding='none' sx= {{paddingTop:1, paddingBottom:1, fontWeight: 400}} align='center' rowSpan={2}>No.</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort8} variant="contained" disableElevation>매물번호</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort7} variant="contained" disableElevation>매물명</Button></StyledTableCell>
            {(findTradeType === '매매') && <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort} variant="contained" disableElevation>매매가(천원)</Button></StyledTableCell>}
            {(findTradeType === '전세') && <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort} variant="contained" disableElevation>전세가(천원)</Button></StyledTableCell>}
            {(findTradeType === '월세') && <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort} variant="contained" disableElevation>보증금(천원)</Button></StyledTableCell>}
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort2} variant="contained" disableElevation>월세(만원)</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort3} variant="contained" disableElevation>평당가(만원)</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort4} variant="contained" disableElevation>계약면적</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort5} variant="contained" disableElevation>전용면적</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}><Button onClick={priceSort6} variant="contained" disableElevation>전용율</Button></StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>층수</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>매물설명</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { landList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
            .map((op, index) => {
                if(findTradeType === '월세') {
                return (<Land 
                  key = {op.id}
                  id = {op.id} 
                  no = {index + 1 + (page * rowsPerPage)}    
                  atclNo = {op.atclNo}
                  title = {op.atclNm}
                  price = {Number(op.prc)*10}
                  rentPrc = {Number(op.rentPrc)}
                  // priceparea = {((op.prc / (Number(op.spc1)/3.3)).toFixed(0))}
                  priceparea = {((op.rentPrc / (Number(op.spc2)/3.3)).toFixed(1))}
                  spc1 = {`${Number(op.spc1).toLocaleString()} ㎡  /  ${(Number(op.spc1)/3.3).toFixed(1)} 평`}
                  spc2 = {`${op.spc2} ㎡  /  ${(Number(op.spc2)/3.3).toFixed(1)} 평`}
                  areaRatio = {`${((op.spc2/op.spc1) * 100).toFixed(1)}%`} 
                  flrInfo = {op.flrInfo} 
                  tagList = {op.tagList}
                  />
                );}
                else {
                  return (<Land 
                    key = {op.id}
                    id = {op.id} 
                    no = {index + 1 + (page * rowsPerPage)}    
                    atclNo = {op.atclNo}
                    title = {op.atclNm}
                    price = {Number(op.prc)*10}
                    rentPrc = {Number(op.rentPrc)}
                    priceparea = {((op.prc / (Number(op.spc2)/3.3)).toFixed(1))}
                    // priceparea = {((op.rentPrc / (Number(op.spc2)/3.3)).toFixed(1))}
                    spc1 = {`${Number(op.spc1).toLocaleString()} ㎡  /  ${(Number(op.spc1)/3.3).toFixed(1)} 평`}
                    spc2 = {`${op.spc2} ㎡  /  ${(Number(op.spc2)/3.3).toFixed(1)} 평`}
                    areaRatio = {`${((op.spc2/op.spc1) * 100).toFixed(1)}%`} 
                    flrInfo = {op.flrInfo} 
                    tagList = {op.tagList}
                    />
                  )
                }   // return ----------
            })
            }
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 500, 1000]}
              count={landList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>

      </Table>
      </TableContainer> 
    </Paper>

    {isMapOpen && <>
    <Button sx={{height:'40px', width:'100%', padding: 0}} variant='contained' color='error' onClick={mapOptionOnOff}>
      지적도 보기 On / Off
    </Button>
    <Paper id="myMap" sx={{mt:2, mb:5,  width: '100%', height: '600px' }}></Paper></>}




  </Container>
  )
}

export default LandList