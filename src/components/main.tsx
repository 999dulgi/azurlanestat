import * as React from 'react';
import { useState, useEffect } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { initDB, useIndexedDB } from 'react-indexed-db-hook';
import { FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box, Paper } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { Checkbox } from '@mui/material';
import { Fab } from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';

import UpperMenu from './UpperMenu';
import FilterDialog from './FilterDialog';
import stat from '../json/stats.json';
import { DBconfig } from '../DBconfig';
import '../css/main.css';


interface Stats {
  classType1: string[];
  statType1: string;
  stat1: string;
  classType2: string[];
  statType2: string;
  stat2: string;
}

interface Data {
  imgsrc: string;
  name: string;
  rarity: string;
  camp: string;
  class: string;
  stat: Stats;
  techpoint: number[];
  howtoget: string;
}

interface ColumnData {
  datakey: keyof Data | string;
  label: string;
  width?: number;
}

interface DBData {
  shipname: string,
  hasShip: boolean,
  isFull: boolean,
  is120: boolean,
  id?: number
}

function createData(id: number): Data {
  return {
    imgsrc: stat[id].imgsrc,
    name: stat[id].korean_name,
    rarity: stat[id].rarity,
    camp: stat[id].camp,
    class: stat[id].class,
    stat: stat[id].shipstats,
    techpoint: [parseInt(stat[id].techpoint[0]), parseInt(stat[id].techpoint[1]), parseInt(stat[id].techpoint[2])],
    howtoget: stat[id].howtoget
  }
}

let classFilter = ["DD", "DDGv", "CL", "CA", "CB", "BM", "BB", "BC", "BBV", "CV", "CVL", "SS", "SSV", "AR", "AE", "IXs", "IXv", "IXm"]
let statFilter = ["Health", "Torpedo", "AntiAir", "Reload", "Accuracy", "Firepower", "Aviation", "Evasion", "AntiSubmarine"]
let campFilter = ["USS", "HMS", "IJN", "KMS", "ROC", "RN", "SN", "FFNF", "MNF", "META", "MOT", "콜라보", "공용"]
let rarityFilter = ["N", "R", "SR", "SSR", "PR", "UR", "DR"]

const initRows: Data[] = Array.from({ length: 756 }, (_, id) => createData(id))
let rows = [...initRows]

function changeFilter(filter: string[], filterType: string) {
  switch (filterType) {
    case 'class':
      classFilter = [...filter];
      break;
    case 'stats':
      statFilter = [...filter];
      break;
    case 'camp':
      campFilter = [...filter];
      break;
    case 'rarity':
      rarityFilter = [...filter];
      break;
  }
  rows = changeData()
}

function changeData(): Data[] {
  const updatedRows = initRows.filter((r) => {
    return classFilter.includes(r.class)
  }).filter((r) => {
    return statFilter.includes(r.stat.statType1) || statFilter.includes(r.stat.statType2)
  }).filter((r) => {
    return campFilter.includes(r.camp)
  }).filter((r) => {
    return rarityFilter.includes(r.rarity)
  })
  return updatedRows;
}

const columns: ColumnData[] = [
  {
    width: 0,
    label: '',
    datakey: 'imgsrc',
  },
  {
    width: 20,
    label: '이름',
    datakey: 'name',
  },
  {
    width: 24,
    label: '획득 / 풀돌 / 120',
    datakey: 'check1'
  },
  {
    width: 0,
    label: '등급',
    datakey: 'rarity',
  },
  {
    width: 0,
    label: '진영',
    datakey: 'camp',
  },
  {
    width: 0,
    label: '함종',
    datakey: 'class',
  },
  {
    width: 28,
    label: '함대기술스탯 (획득 / 120 달성)',
    datakey: 'stat',
  },
  {
    width: 32,
    label: '진영점수(획득 / 풀돌 / 120 달성)',
    datakey: 'techpoint',
  },
  {
    width: 100,
    label: '입수처',
    datakey: 'howtoget',
  },
]

const classDict = {
  'DD': '구축함',
  'DDGv': '미사일 구축함',
  'CL': '경순양함',
  'CA': '중순양함',
  'CB': '대형순양함',
  'BM': '모니터함',
  'BB': '전함',
  'BC': '순양전함',
  'BBV': '항공전함',
  'CV': '항공모함',
  'CVL': '경항공모함',
  'SS': '잠수함',
  'SSV': '잠수항모',
  'AR': '공작함',
  'AE': '운송함',
  'IXs': '범선(잠수)',
  'IXv': '범선(선봉)',
  'IXm': '범선(주력)',
}

const tableStyle = {
  backgroundColor: '#181a1b',
  color: 'rgba(232, 230, 227, 0.87)',
  borderBottomColor: '#393d40'
}

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function rowContentCheck(name: string, shipDB: DBData[], setShipDB: React.Dispatch<React.SetStateAction<DBData[]>>) {
  let shipIndex = shipDB.findIndex(obj => obj.shipname === name);
  if (shipIndex === -1) {
    shipDB.push({ shipname: name, hasShip: false, isFull: false, is120: false });
    setShipDB([...shipDB])
    shipIndex = shipDB.length - 1
  }

  return (
    <FormGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Checkbox sx={{ color: '#929290' }} checked={!!shipDB[shipIndex].hasShip} onChange={(e, checked) => { shipDB[shipIndex].hasShip = checked; setShipDB([...shipDB]) }} />
      <Checkbox sx={{ color: '#929290' }} checked={!!shipDB[shipIndex].isFull} onChange={(e, checked) => { shipDB[shipIndex].isFull = checked; setShipDB([...shipDB]) }} />
      <Checkbox sx={{ color: '#929290' }} checked={!!shipDB[shipIndex].is120} onChange={(e, checked) => { shipDB[shipIndex].is120 = checked; setShipDB([...shipDB]) }} />
    </FormGroup>
  )
}

function rowContentStat(stats: Stats) {

  if (stats.classType1[0] === 'None') {
    return "기술스탯 없음"
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '8px' }}>
        {stats.classType1.map((classType) => {
          return (
            <Tooltip title={classDict[classType]} arrow>
              <img src={'/static/images/icon/classification/' + classType + '.png'} alt={classType} width="30px" height="18px" />
            </Tooltip>
          );
        })}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '36px', height: '18px' }}>
          <img src={'/static/images/icon/stat/' + stats.statType1 + '.png'} alt={stats.statType1} height="18px" />
        </Box>
        {'+' + stats.stat1}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {stats.classType2.map((classType) => {
          return (
            <Tooltip title={classDict[classType]} arrow>
              <img src={'/static/images/icon/classification/' + classType + '.png'} alt={classType} width="30px" height="18px" />
            </Tooltip>
          );
        })}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '36px', height: '18px' }}>
          <img src={'/static/images/icon/stat/' + stats.statType2 + '.png'} alt={stats.statType2} height="18px" />
        </Box>
        {'+' + stats.stat2}
      </Box>
    </Box>
  );
}

function rowContentFleet(techpoint: number[]) {
  if (techpoint[0] === 0) {
    return '진영점수 없음'
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {techpoint.map((tp) => {
        return (
          <Typography sx={{ fontSize: 16 }}>
            {'+ ' + tp}
          </Typography>
        )
      })}
    </Box>
  );
}

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.datakey}
          variant="head"
          style={{ width: column.width }}
          sx={tableStyle}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Data, shipDB: DBData[], setShipDB: React.Dispatch<React.SetStateAction<DBData[]>>) {
  return (
    <>
      <TableCell key={columns[0].datakey} sx={tableStyle}>
        <img src={row.imgsrc} alt={row.name}></img>
      </TableCell>
      <TableCell key={columns[1].datakey} sx={tableStyle}>
        {row.name}
      </TableCell>
      <TableCell key={columns[8].datakey} sx={tableStyle}>
        {rowContentCheck(row.name, shipDB, setShipDB)}
      </TableCell>
      <TableCell key={columns[2].datakey} sx={tableStyle}>
        {row.rarity}
      </TableCell>
      <TableCell key={columns[3].datakey} sx={tableStyle}>
        {row.camp}
      </TableCell>
      <TableCell key={columns[4].datakey} sx={tableStyle}>
        {classDict[row.class]}
      </TableCell>
      <TableCell key={columns[5].datakey} sx={tableStyle}>
        {rowContentStat(row.stat)}
      </TableCell>
      <TableCell key={columns[6].datakey} sx={tableStyle}>
        {rowContentFleet(row.techpoint)}
      </TableCell>
      <TableCell key={columns[7].datakey} sx={tableStyle}>
        {row.howtoget}
      </TableCell>
    </>
  );
}

initDB(DBconfig);

export default function Main(props: any) {

  const [open, setOpen] = useState(false);
  const [shipDB, setShipDB] = useState<DBData[]>([])
  const DB = useIndexedDB('shiplevel');

  useEffect(() => {
    DB.getAll().then((db) => { if (db === undefined) return; setShipDB(db); }, (error) => { console.log(error) });
  }, [])

  useEffect(() => {
    (() => {
      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", handleUnload);
      }
    })();

    return (() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleUnload);
      }
    });
  }, [])

  const handleUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault()

    shipDB.map((value) => {
      if (value.id === undefined) {
        DB.add({ "shipname": value.shipname, "hasShip": value.hasShip, "isFull": value.isFull, "is120": value.is120 });
      }
      else {
        DB.update({ "shipname": value.shipname, "hasShip": value.hasShip, "isFull": value.isFull, "is120": value.is120, "id": value.id });
      }
    })
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className='main'>
      <UpperMenu />
      <Box style={{ width: '100%', flexGrow: '1', overflowX: 'auto', backgroundColor: '#181a1b' }}>
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={(_index, data) => rowContent(_index, data, shipDB, setShipDB)}
          style={{ minWidth: 1600, backgroundColor: '#181a1b' }}
        />
      </Box>
      <Fab size="medium" aria-label="filter" sx={{ position: 'absolute', bottom: 32, right: 32, backgroundColor: '#181a1b', "&:hover": { bgcolor: '#34393c' } }} onClick={() => handleOpen()}>
        <FilterListIcon sx={{ color: 'rgba(232, 230, 227, 0.87)' }} />
      </Fab>
      <FilterDialog open={open} handleClose={() => handleClose()} changeData={changeFilter} />
    </Box>
  );
}



