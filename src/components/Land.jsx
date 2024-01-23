import React from 'react'
import { styled } from '@mui/material/styles';
import { TableCell, TableRow } from '@mui/material';



function Land(props) {

  // Initialize Variable ==================================================
const {no, atclNo, title, price, rentPrc, priceparea, spc1, spc2, areaRatio, flrInfo, tagList } = props

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


  return (
    <StyledTableRow>
      <TableCell padding='none' sx= {{paddingTop:0.6, paddingBottom:0.6}} align='center'>{no}</TableCell>
      <TableCell padding='none' align='center'>{atclNo}</TableCell>
      <TableCell padding='none' align='left'>{title}</TableCell>
      <TableCell padding='none' align='right'>{price.toLocaleString()}</TableCell>
      <TableCell padding='none' align='right'>{rentPrc.toLocaleString()}</TableCell>
      <TableCell padding='none' align='center'>{Number(priceparea).toLocaleString()}</TableCell>
      <TableCell padding='none' align='center'>{spc1}</TableCell>
      <TableCell padding='none' align='center'>{spc2}</TableCell>
      <TableCell padding='none' align='center'>{areaRatio}</TableCell>
      <TableCell padding='none' align='center'>{flrInfo}</TableCell>
      <TableCell paddingLeft='2px' align='left'>{`${tagList[0]},  ${tagList[1]},  ${tagList[2]},  ${tagList[3]}`}</TableCell>

    </StyledTableRow>    
  )
}

export default Land