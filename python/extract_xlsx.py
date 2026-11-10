#!/usr/bin/env python3
"""Read cached values from XLSX and show missing cached formula results.

Never re-calculate Excel formulas silently. Preserve coordinates for auditing.
"""
import argparse,json
from pathlib import Path
from openpyxl import load_workbook


def extract(input_path, output_path):
    values=load_workbook(input_path,read_only=True,data_only=True)
    formulas=load_workbook(input_path,read_only=True,data_only=False)
    output={'source_file':Path(input_path).name,'sheets':{},'warnings':[]}
    for name in values.sheetnames:
        value_sheet=values[name]
        formula_sheet=formulas[name]
        cells=[]
        for value_row,formula_row in zip(value_sheet.iter_rows(),formula_sheet.iter_rows()):
            for cell, formula in zip(value_row,formula_row):
                if cell.value is None and formula.value is None:
                    continue
                row={'cell':cell.coordinate,'value':cell.value}
                if formula.data_type=='f':
                    row['formula']=formula.value
                    if cell.value is None:
                        output['warnings'].append(f'Uncalculated formula cache: {name}!{cell.coordinate}')
                cells.append(row)
        output['sheets'][name]=cells
    Path(output_path).write_text(json.dumps(output,ensure_ascii=False,default=str,indent=2),encoding='utf-8')
    print(json.dumps({'sheets':len(output['sheets']),'warnings':len(output['warnings'])}))


if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('input')
    p.add_argument('--out',required=True)
    a=p.parse_args()
    extract(a.input,a.out)
