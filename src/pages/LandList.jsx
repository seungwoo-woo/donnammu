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





function LandList() {

  // Table Pagination Start ----------------------------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [ landList, setLandList ] = useState([])
  const [ findDong, setFindDong ] = useState()
  const [ findInputDong, setFindInputDong ] = useState()
  const [ findType, setFindType ] = useState()
  const [ findInputType, setFindInputType ] = useState()
  const [ findTradeType, setFindTradeType ] = useState()
  const [ findInputTradeType, setFindInputTradeType ] = useState()
  // const [ dongNameList, setDongNameList ] = useState([{name: '내곡동', code: '1165010900'}, {name: '반포동', code: '1165010700'}])
  // https://new.land.naver.com/api/regions/list?cortarNo=1165000000  서초구 동이름, 동코드 알아오기
  const [ dongNameList, setDongNameList ] = useState(['내곡동', '반포동', '방배동', '서초동', '신원동', '양재동'])
  const [ dongCodeList, setDongCodeList ] = useState(['1165010900', '1165010700', '1165010100', '1165010800', '1165011100', '1165010200'])
  const [ typeNameList, setTypeNameList ] = useState(['아파트', '상가'])
  const [ tradeTypeNameList, setTradeTypeNameList ] = useState(['매매', '월세'])

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
  const fetchAllLandList = async () => {
    let temp = []
    try{
      // const res1 = await axios.get("https://fin.land.naver.com/articles/2401460139")
      const res1 = await axios.get("https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=APT&tradTpCd=A1&cortarNo=1165010800&sort=rank&page=1")
      const res2 = await axios.get("https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=SG&tradTpCd=A1&cortarNo=1165010800&sort=rank&page=2")
      const res3 = await axios.get("https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=SG&tradTpCd=A1&cortarNo=1165010800&sort=rank&page=3")
      const res4 = await axios.get("https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=SG&tradTpCd=A1&cortarNo=1165010800&sort=rank&page=4")
      const res5 = await axios.get("https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=SG&tradTpCd=A1&cortarNo=1165010800&sort=rank&page=5")
      
      console.log(res1.data)
      temp = [...temp, ...res1.data.body]
      temp = [...temp, ...res2.data.body]
      temp = [...temp, ...res3.data.body]
      temp = [...temp, ...res4.data.body]
      temp = [...temp, ...res5.data.body]
      console.log(temp)    
      
      setLandList(temp)
    }catch(err){
      console.log(err)
    }
  }
  
  fetchAllLandList()
}, [])


const priceSort = () => {
  
}

const handleClickFind = async () => {

  let temp = []
  let type = ''
  let tradeType = ''
  let dongCode = dongCodeList[dongNameList.indexOf(findDong)]

  if (findType === '아파트') {
    type = 'APT'
  }  
  if (findType === '상가') {
    type = 'SG'
  }

  if (findTradeType === '매매') {
    tradeType = 'A1'
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
      
      console.log(res1.data)
      temp = [...temp, ...res1.data.body]
      temp = [...temp, ...res2.data.body]
      temp = [...temp, ...res3.data.body]
      temp = [...temp, ...res4.data.body]
      temp = [...temp, ...res5.data.body]
      console.log(temp)
      
      setLandList(temp)
    }catch(err){
      console.log(err)
    }

}





  return (
    <Container maxWidth='false' sx={{m: 0}}>


    <div style={{ marginTop:10,  width: 600, display: 'flex',  justifyContent: 'space-between', alignItems: 'flex-end' }}>
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

    </div>




    <Paper style={{marginTop: 10, marginLeft: 0, marginRight: 0}} elevation={3}>
    <TableContainer>
      <Table stickyHeader size='small' aria-label="sticky table">        
        <TableHead>
          <TableRow>
            <StyledTableCell padding='none' sx= {{paddingTop:1, paddingBottom:1, fontWeight: 400}} align='center' rowSpan={2}>No.</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>매물번호</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>매물명</StyledTableCell>
            {(findTradeType === '매매') && <StyledTableCell onClick={priceSort} padding='none' sx={{fontWeight: 400, cursor: 'pointer'}} align='center' rowSpan={2}>매매가(천원)</StyledTableCell>}
            {(findTradeType === '월세') && <StyledTableCell onClick={priceSort} padding='none' sx={{fontWeight: 400, cursor: 'pointer'}} align='center' rowSpan={2}>보증금(천원)</StyledTableCell>}
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>월세(만원)</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>평당가</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>계약면적</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>전용면적</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>층수</StyledTableCell>
            <StyledTableCell padding='none' sx={{fontWeight: 400}} align='center' rowSpan={2}>매물설명</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          { landList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)              
            .map((op, index) => {
                return (<Land 
                  key = {op.id}
                  id = {op.id} 
                  no = {index + 1 + (page * rowsPerPage)}    
                  atclNo = {op.atclNo}
                  title = {op.atclNm}
                  price = {Number(op.prc)*10}
                  rentPrc = {Number(op.rentPrc)}
                  priceparea = {((op.prc / (Number(op.spc1)/3.3)).toFixed(0))}
                  spc1 = {`${op.spc1} m2  /  ${(Number(op.spc1)/3.3).toFixed(1)} 평`}
                  spc2 = {`${op.spc2} m2  /  ${(Number(op.spc2)/3.3).toFixed(1)} 평`}
                  flrInfo = {op.flrInfo} 
                  tagList = {op.tagList}
                  />
                );    // return ----------
            })
            }
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
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

  


  </Container>
  )
}

export default LandList