import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { TableCell, TableRow } from '@mui/material';
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, Paper, TableContainer, Table, TextField, TableBody, TableFooter, TableHead, TablePagination, tableCellClasses, Container } from '@mui/material';
import RealPriceRow from './RealPriceRow';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


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




function Land(props) {

  // Initialize Variable ==================================================
const {no, atclNo, title, price, rentPrc, priceparea, priceparea2, spc1, spc2, areaRatio, flrInfo, tagList, tradeType} = props

const [ realPrice, setRealPrice ] = useState()
console.log(tradeType)

const [open, setOpen] = useState(false);


// Table style ----------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));


const openWindow = async () => {
  console.log(tradeType)
  console.log(atclNo)
  const res = await axios.get(`https://fin.land.naver.com/front-api/v1/article/key?articleId=${atclNo}`)

  console.log(res.data.result.key)

  const complexNo = res.data.result.key.complexNumber
  const pyeongTypeNo = res.data.result.key.pyeongTypeNumber
  const res2 = await axios.get(`https://fin.land.naver.com/front-api/v1/article/realPrice?complexNumber=${complexNo}&pyeongTypeNumber=${pyeongTypeNo}&realEstateType=A01&page=1&size=5&tradeType=${tradeType}`)

  console.log(res2)
  setRealPrice(res2.data.result.list)
  
  setOpen(true);

}

const handleClose = () => {
  setOpen(false);
};



  return (
    <>
      <StyledTableRow>
        <TableCell padding='none' sx= {{paddingTop:0.6, paddingBottom:0.6}} align='center'>{no}</TableCell>
        <TableCell padding='none' align='center'>{atclNo}</TableCell>
        <TableCell padding='none' align='left' sx= {{cursor: 'pointer'}} onClick={openWindow}>{title}</TableCell>
        <TableCell padding='none' align='right'>{price.toLocaleString()}</TableCell>
        <TableCell padding='none' align='right'>{rentPrc.toLocaleString()}</TableCell>
        <TableCell padding='none' align='center'>{Number(priceparea).toLocaleString()}</TableCell>
        <TableCell padding='none' align='center'>{Number(priceparea2).toLocaleString()}</TableCell>
        <TableCell padding='none' align='center'>{spc1}</TableCell>
        <TableCell padding='none' align='center'>{spc2}</TableCell>
        <TableCell padding='none' align='center'>{areaRatio}</TableCell>
        <TableCell padding='none' align='center'>{flrInfo}</TableCell>
        {(tagList.length === 4) && <TableCell paddingLeft='2px' align='left'>{`${tagList[0]},  ${tagList[1]},  ${tagList[2]}, ${tagList[3]}`}</TableCell>}
        {(tagList.length === 3) && <TableCell paddingLeft='2px' align='left'>{`${tagList[0]},  ${tagList[1]},  ${tagList[2]}`}</TableCell>}
      </StyledTableRow>


      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          최근 실거래 정보
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>

        <TableContainer>
          <Table stickyHeader size='small' aria-label="sticky table">        
            <TableHead>
              <TableRow>
                <StyledTableCell padding='none' sx={{fontWeight: 400, width: 200}} align='center'>거래일</StyledTableCell>
                <StyledTableCell padding='none' sx={{fontWeight: 400, width: 200}} align='center'>해당 층</StyledTableCell>
                {tradeType === 'A1' && <StyledTableCell padding='none' sx={{fontWeight: 400, width: 300}} align='center'>매매가(천원)</StyledTableCell>}
                {tradeType === 'B1' && <StyledTableCell padding='none' sx={{fontWeight: 400, width: 300}} align='center'>전세가(천원)</StyledTableCell>}
                {tradeType === 'B2' && <StyledTableCell padding='none' sx={{fontWeight: 400, width: 300}} align='center'>보증금(천원)</StyledTableCell>}
                {tradeType === 'B2' && <StyledTableCell padding='none' sx={{fontWeight: 400, width: 300}} align='center'>월세(만원)</StyledTableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {realPrice  && realPrice.map((item, index) => {
                return (<RealPriceRow item={item} tradeType={tradeType}/>)
              }) 
              }

            </TableBody>

          </Table>
      </TableContainer> 


          

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>    
  )
}

export default Land