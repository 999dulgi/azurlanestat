import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';

interface DialogDict {
    [index: string]: string
}

const classDict: DialogDict = {
    'ALL': '전체',
    'DD': '구축, 미구',
    'CL': '경순',
    'CA': '중순, 대순, 모니터',
    'BB': '전함, 순전, 항전',
    'CV': '항모, 경항모',
    'SS': '잠수, 잠항',
    'AR': '공작, 운송',
    'IX': '범선'
}

const statsDict: DialogDict = {
    'ALL': '전체',
    'Health': '내구',
    'Torpedo': '뇌장',
    'AntiAir': '대공',
    'Reload': '장전',
    'Accuracy': '명중',
    'Firepower': '화력',
    'Aviation': '항공',
    'Evasion': '기동',
    'AntiSubmarine': '대잠'
}

const campDict: DialogDict = {
    'ALL': '전체',
    'USS': 'USS',
    'HMS': 'HMS',
    'IJN': 'IJN',
    'KMS': 'KMS',
    'ROC': 'ROC',
    'RN': 'RN',
    'SN': 'SN',
    'FFNF': 'FFNF',
    'MNF': 'MNF',
    'META': 'META',
    'MOT': 'MOT',
    '콜라보': '콜라보',
    '공용': '공용'  
}

const rarityDict: DialogDict = {
    'ALL': '전체',
    'N': 'N',
    'R': 'R',
    'SR': 'SR',
    'SSR': 'SSR',
    'UR': 'UR'
}

const tableStyle = {
    backgroundColor: '#181a1b',
    color: 'rgba(232, 230, 227, 0.87)',
    borderBottomColor: '#393d40',
}

const toggleButtonStyle = {
    "&.Mui-selected, &.Mui-selected:hover": { color: 'rgba(232, 230, 227, 0.87)', backgroundColor: '#181a1b' },
    color: 'rgba(87, 87, 87, 0.87)',
    backgroundColor: '#181a1b',
    borderBottomColor: '#393d40',
}

export default function FilterDialog({ open, handleClose, changeData }: { open: boolean, handleClose: () => void, changeData: (arg0: string[], arg1: string) => void }) {
    const [sclass, setClass] = useState(() => Object.keys(classDict));
    const [stats, setStats] = useState(() => Object.keys(statsDict));
    const [camp, setCamp] = useState(() => Object.keys(campDict));
    const [rarity, setRarity] = useState(() => Object.keys(rarityDict));

    useEffect(() => {
        const filterClass = { 'ALL': [], 'DD': ['DD', 'DDGv'], 'CL': ['CL'], 'CA': ['CA', 'CB', 'BM'], 'BB': ['BB', 'BC', 'BBV'], 'CV': ['CV', 'CVL'], 'SS': ['SS', 'SSV'], 'AR': ['AR', 'AE'], 'IX': ['IXs', 'IXv', 'IXm'] };
        let filterClassData: string[] = []
        sclass.map((value) => {
            filterClassData = filterClassData.concat(filterClass[value])
        })
        changeData(filterClassData, 'class')
    }, [sclass]);

    useEffect(() => {
        const filterStatData: string[] = stats.slice()
        changeData(filterStatData.filter(element => element !== "ALL"), 'stats')
    }, [stats]);

    useEffect(() => {
        const filterCampData: string[] = camp.slice()
        changeData(filterCampData.filter(element => element !== "ALL"), 'camp')
    }, [camp]);

    useEffect(() => {
        const filterRarity = { 'ALL': [], 'N': ['N'], 'R': ['R'], 'SR': ['SR'], 'SSR': ['SSR', 'PR'], 'UR': ['UR', 'DR'] }
        let filterRarityData: string[] = []
        rarity.map((value) => {
            filterRarityData = filterRarityData.concat(filterRarity[value])
        })
        changeData(filterRarityData, 'rarity')
    }, [rarity]);

    const handleEvent = (event: React.MouseEvent<HTMLElement>, setList: React.Dispatch<React.SetStateAction<string[]>>, value: string[]) => {
        setList(value);
    }

    const handleAllSelectEvent = (event: React.MouseEvent<HTMLElement>, setList: React.Dispatch<React.SetStateAction<string[]>>, value: string[], dict: DialogDict) => {
        if (JSON.stringify(value) === JSON.stringify(Object.keys(dict))) {
            setList([]);
        }
        else {
            setList(Object.keys(dict))
        }
    }

    const FilterToggleButton = (key: string, value: string) => {
        return (
            <ToggleButton value={key} key={key} sx={toggleButtonStyle}>
                {value}
            </ToggleButton>
        )
    }

    const FilterToggleButtonGroup = (name: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, dict: DialogDict) => {
        return (
            <>
                <Typography sx={{ my: '8px' }}>{name}</Typography>
                <ToggleButtonGroup
                    value={list}
                    onChange={(e, value) => handleEvent(e, setList, value)}
                    aria-label={name + " select"}
                    orientation={window.innerWidth <= 768 ? 'vertical' : 'horizontal'}
                    size='medium'
                    sx={tableStyle}
                >
                    <ToggleButton value="ALL" onChange={(e, value) => handleAllSelectEvent(e, setList, list, dict)} sx={toggleButtonStyle}>
                        전체
                    </ToggleButton>
                    {
                        Object.keys(dict).map((value: string, index: number) => {
                            if (index === 0) {
                                return
                            }
                            return FilterToggleButton(value, dict[value])
                        })
                    }
                </ToggleButtonGroup>
            </>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogContent sx={[{ display: 'flex', flexDirection: 'column' }, tableStyle]} >
                {
                    FilterToggleButtonGroup("함선", sclass, setClass, classDict)
                }
                {
                    FilterToggleButtonGroup("스탯", stats, setStats, statsDict)
                }
                {
                    FilterToggleButtonGroup("진영", camp, setCamp, campDict)
                }
                {
                    FilterToggleButtonGroup("등급", rarity, setRarity, rarityDict)
                }
                <Button aria-label="close" onClick={handleClose}>
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    )
}