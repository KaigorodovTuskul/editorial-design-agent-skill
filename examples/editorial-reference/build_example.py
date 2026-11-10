"""Hand-art-directed example: seven independent HTML documents, no engine template restrictions.
Numbers and narrative are adapted from the user-supplied illustrative strategy deck.
"""
from pathlib import Path
from html import escape
root=Path(__file__).parent
sd=root/'slides';sd.mkdir(exist_ok=True)

def e(s, cls='sans', style=''):
    return f'<div class="ed {cls}" data-editable="true"'+(f' style="{style}"' if style else '')+f'>{escape(str(s))}</div>'

def icon_svg(kind):
    paths={
      'fees':'<path d="M6 24h35M10 13h27M16 5h15M11 33h27"/><circle cx="38" cy="9" r="5"/>',
      'alm':'<path d="M6 34h35M10 22h9v12M23 10h9v24M36 17h8v17"/><path d="M7 9l12-3 9 3 9-4"/>',
      'eff':'<path d="M11 8h27v9H11zM11 26h27v9H11zM18 17v9M32 17v9"/><path d="M5 12h5M38 30h6"/>'
    }
    return f'<svg class="lever-icon" viewBox="0 0 52 42" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{paths[kind]}</g></svg>'

def wrap(i, body, title, dark=False, section='СТРАТЕГИЧЕСКАЯ СЕССИЯ / 2027'):
    header=f'''<div class="header">{e(section,'smallcap')}{e('АНАЛИТИЧЕСКИЙ ДИЗАЙН-ПРОТОТИП','smallcap')}</div>'''
    footer=f'''<div class="footer">{e('Иллюстративные данные · не утвержденный финансовый план','sans')}{e(f'{i:02d} / 07','sans')}</div>'''
    html=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,initial-scale=1"><title>{escape(title)}</title><link rel="stylesheet" href="../assets/editorial.css"></head><body><section class="slide{' dark' if dark else ''}" data-slide-id="{i:02d}">{header}{body}{footer}</section></body></html>'''
    (sd/f'{i:02d}-{title.lower().replace(" ","-")}.html').write_text(html,encoding='utf-8')

# 01 / Contrasting monumental type with topographic contour graphic.
body='''<svg class="cover-mark" viewBox="0 0 1100 1080" aria-hidden="true">'''
for k in range(21):
    yy=130+k*35
    body+=f'<path class="cover-orbit" d="M{-220+k*10} {yy} C 230 {yy-240}, 430 {yy+180}, 680 {yy-30} S 960 {yy-290}, 1270 {yy+25}" />'
for r in [160,270,380,490]:
    body+=f'<circle class="cover-orbit-strong" cx="875" cy="475" r="{r}" />'
body+='''<path class="cover-dash" d="M 110 845 Q 770 920 1070 280" /></svg>'''
body+='''<svg class="cover-ribbon" viewBox="0 0 1200 1100" aria-hidden="true"><defs>
<linearGradient id="fold01" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#10458B" stop-opacity=".08"/><stop offset=".44" stop-color="#3AA8F9" stop-opacity=".47"/><stop offset=".77" stop-color="#84BCFA" stop-opacity=".12"/><stop offset="1" stop-color="#A297F3" stop-opacity=".70"/></linearGradient>
<linearGradient id="fold02" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C1F2FF" stop-opacity=".0"/><stop offset=".58" stop-color="#56D0FF" stop-opacity=".34"/><stop offset="1" stop-color="#9C8CE5" stop-opacity=".05"/></linearGradient></defs>
<path d="M650 -120C940 120 750 435 390 575S120 925 1020 1080C680 840 755 600 920 385S1130 60 650 -120Z" fill="url(#fold01)"/>
<path d="M1100 -80C835 160 1110 430 1000 660S760 1000 340 1110C760 770 725 530 720 310S760 15 1100 -80Z" fill="url(#fold02)"/>
<path d="M615 -90C855 150 738 447 375 596" fill="none" stroke="#A6E9FF" stroke-width="2" opacity=".42"/>
</svg>''' 
body+='<div class="cover-index"><div class="bar"></div>'+e('СТРАТЕГИЯ / 2027','smallcap white')+'</div>'
body+='<div class="cover-title">'+e('Модель','serif white')+e('прибыли.','serif-i', 'color:#B8E7FF')+e('2027','serif white')+'</div>'
body+='<div class="cover-sub">'+e('Не увеличивать масштаб любой ценой.','sans white')+e('Перестроить экономику банка — и роль капитала.','sans white')+'</div>'
body+='<div class="cover-aside">'+e('Банк · рабочая версия','sans white')+e('Семь редакционных разворотов','sans white')+e('Данные из исходного макета','sans white')+'</div>'
wrap(1,body,'Модель прибыли',True)

# 02 / Asymmetric editorial big-number, dark fact rail.
body='<div class="position-main">'+e('2027 год начинается не с обещания','serif')+e('роста. С пересмотра источников','serif')+e('прибыли.','serif-i accent')+'</div>'
body+='<div class="loss">'+e('−76,5','serif lavender')+'<div class="loss-unit">'+e('млн ₽','sans medium')+'</div></div>'
body+='<div class="loss-rule"></div><div class="loss-note">'+e('Прогноз чистого результата 2026 года —','sans')+e('отправная точка новой стратегии.','sans')+'</div>'
body+='<aside class="right-panel">'+e('БАЛАНС НА КОНЕЦ 2026','smallcap white')+'<div style="height:44px"></div>'+e('46,3','serif white','font-size:106px')+e('млрд ₽ · активы банка','sans white','font-size:23px')+'<div class="panel-rule"></div>'
for label,val in [('Кредитный портфель','31,8'),('Средства клиентов','33,7'),('Регуляторный капитал','5,39'),('Н1.0','11,84%')]:
    body+=f'<div class="metric">{e(label,"sans white")}{e(val,"sans white medium")}</div><div class="panel-rule"></div>'
body+='</aside>'
wrap(2,body,'От правильной базы',False,'СТРАТЕГИЯ / ОТ ПРАВИЛЬНОЙ БАЗЫ')

# 03 / Editorial headline and transformation diagram; very different silhouette.
body='<div class="shift-hero">'+e('Сменить логику.','serif')+e('Не наращивать','serif-i accent')+e('объём.','serif-i accent')+'</div>'
body+='<div class="shift-caption">'+e('Прежняя модель строилась вокруг масштаба','sans')+e('баланса и докапитализации. Новый критерий','sans')+e('— прибыль при сохранении риск-аппетита.','sans')+'</div>'
body+='<div class="shift-number"><div class="shift-stroke"></div><div class="shift-then">'+e('ПРЕЖНИЙ АКЦЕНТ','smallcap faint')+'<div style="height:22px"></div>'+e('Больше активов.','serif')+e('Больше кредитов.','serif')+'</div><div class="shift-transition"></div><div class="shift-now">'+e('НОВЫЙ АКЦЕНТ','smallcap accent')+'<div style="height:24px"></div>'+e('Комиссии · ALM · дисциплина','serif')+e('стоимости и расходов.','serif')+'</div><div class="shift-stroke two"></div></div>'
wrap(3,body,'Сменить логику',False,'СТРАТЕГИЯ / ИЗМЕНЕНИЕ ЛОГИКИ')

# 04 / Dense horizontal ledger, editorial not card-grid.
body='<div class="levers-header">'+e('Три рычага.','serif')+e('Один результат.','serif-i accent')+'</div><div class="levers-rows">'
levers=[('01','Комиссионный бизнес',['Тарифы, продукты, обороты и ВЭД.','Монетизация клиентских отношений.'],'+221,8'),
('02','Казначейство / ALM',['Стоимость ресурсов и ликвидность.','Эффективность структуры баланса.'],'+70,2'),
('03','Операционные расходы',['ФОТ, административные процессы.','Расходы на внедрение изменений.'],'+111,3')]
for row,(idx,label,details,val) in enumerate(levers):
    body+='<div class="lever"><div class="idx">'+e(idx,'serif')+icon_svg(['fees','alm','eff'][row])+'</div><div class="heading">'+e(label,'serif')+'</div><div class="details">'+''.join(e(x,'sans') for x in details)+'</div><div class="amount">'+e(val,'sans')+e('млн ₽ до налога','sans faint','font-size:18px')+'</div></div>'
body+='</div>'
wrap(4,body,'Три рычага',False,'СТРАТЕГИЯ / ЭКОНОМИКА ИНИЦИАТИВ')

# 05 / Scenario comparison on a common quantitative axis.
body='<svg class="scenario-field" viewBox="0 0 860 640" aria-hidden="true">'
for q in range(10):
    body+=f'<path d="M {q*70} 0 Q {q*70+150} 300 {q*70} 640" stroke="#3D72B7" stroke-opacity=".10" stroke-width="2" fill="none"/>'
body+='</svg>'
body+='<div class="scenarios-title">'+e('Один риск-аппетит.','serif')+e('Три траектории.','serif-i accent')+'</div>'
body+='<div class="scenario-plot"><div class="scenario-zero"></div><div class="scenario-head">'+e('0 / результат, млн ₽','sans faint')+'</div>'
scenarios=[('01','Инерционный','−288',-288),('02','Интенсивный','−142',-142),('03','Ускоренная оптимизация','+99',99)]
for idx,name,val,number in scenarios:
    x=627 if number<0 else 627
    barwidth=abs(number)*1.62
    left=627-barwidth if number<0 else 627
    color='background:#356FCF' if number<0 else 'background:#7160CE'
    body+='<div class="scenario"><div class="scenario-idx">'+e(idx)+'</div><div class="scenario-label">'+e(name)+'</div><div class="scenario-bar-wrap">'+f'<div class="scenario-bar" style="left:{left}px;width:{barwidth}px;{color}"></div>'+'<div class="scenario-dot" style="left:622px"></div>'+'<div class="scenario-num">'+e(val,'sans medium', 'color:#173E91' if number<0 else 'color:#5849B3')+'</div></div></div>'
body+='</div><div class="scenario-nums">'+e('Н1.0 / инерционный: 11,21%')+e('интенсивный: 11,59%')+e('ускоренный: 12,01%')+'</div>'
wrap(5,body,'Три траектории',False,'ФИНАНСОВАЯ МОДЕЛЬ / СЦЕНАРИИ')

# 06 / Waterfall quantitative exhibit, no raster chart-label text.
body='<svg class="bridge-plane" viewBox="0 0 1920 1080" aria-hidden="true"><defs><linearGradient id="ab6" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#EDF7FF"/><stop offset=".5" stop-color="#DBE8FF"/><stop offset="1" stop-color="#DED6FB"/></linearGradient></defs><path fill="url(#ab6)" d="M1280 0H1920V1080H1580L1160 550Z"/><path d="M1200 0L1920 680M1320 0L1920 620M1430 0L1920 570" stroke="#6A84C5" stroke-width="1.5" opacity=".17"/></svg>'
body+='<div class="bridge-title">'+e('Прибыль появляется','serif')+e('не из прогноза. Из решений.','serif-i accent')+'</div>'
body+='<div class="bridge-sub">'+e('Изменение относительно инерционной базы · млн ₽ · расчетные эффекты','sans')+'</div><div class="bridge"><div class="bridge-axis"></div>'
bridge=[('База','−288',-288),('Комиссии','+222',222),('Казначейство','+70',70),('Операционная','+111',111),('Кредитная','+16',16),('Налог','−33',-33),('Итог','+99',99)]
# bars represent positive effects; waterfall cumulative plotted on consistent scale, starting -288 and ending +99.
cum=-288
for i,(label,val,change) in enumerate(bridge):
    before=cum
    if i==0:after=cum
    elif i==len(bridge)-1:after=99
    else:after=cum+change;cum=after
    # map -300..130 to y bottom coordinate 284..55
    scale=lambda v: 275 - (v+300)*.48
    if i in [0,len(bridge)-1]:
        base=scale(0);end=scale(after); top=min(base,end);height=abs(base-end)
    else:
        top=min(scale(before),scale(after));height=abs(scale(before)-scale(after))
    body+=f'<div class="bridge-item" style="left:{i*243}px">'
    body+='<div class="bridge-label">'+e(label)+'</div><div class="bridge-value">'+e(val,'sans')+'</div>'
    kind='negative' if change<0 else 'violet' if i==len(bridge)-1 else ''
    body+=f'<div class="bridge-bar {kind}" style="top:{max(110,top)}px;height:{max(8,height)}px"></div></div>'
# Horizontal connectors make it a true stepwise bridge rather than unrelated bars.
for i in range(1,len(bridge)-1):
    running=-288+sum(b[2] for b in bridge[1:i+1])
    yy=275 - (running+300)*.48
    body+=f'<div class="bridge-link" style="top:{yy:.1f}px;left:{i*243+120}px;width:205px"></div>'
body+='</div><div class="bridge-footer">'+e('Суммарное улучшение результата','serif')+e('+386,6 млн ₽','serif accent','font-size:43px')+'</div>'
body+='<div class="bridge-disclaimer">'+e('Отдельные эффекты округлены; итоговая величина приведена по исходному макету.','sans faint')+'</div>'
wrap(6,body,'Прибыль из решений',False,'ФИНАНСОВАЯ МОДЕЛЬ / ДЕКОМПОЗИЦИЯ')

# 07 / Dark end paper, echoes cover, decisions in restrained columns.
body='<svg class="decision-fold" viewBox="0 0 1200 800" aria-hidden="true"><defs><linearGradient id="df07" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#3F74DD" stop-opacity="0"/><stop offset=".5" stop-color="#428FEA" stop-opacity=".55"/><stop offset=".8" stop-color="#A38CFF" stop-opacity=".44"/><stop offset="1" stop-color="#83D2F6" stop-opacity=".08"/></linearGradient></defs><path d="M1200 90Q700 55 500 425T0 720Q560 435 880 510T1200 750Z" fill="url(#df07)"/><path d="M0 690Q530 355 790 450T1200 710" fill="none" stroke="#BBD9FF" stroke-width="2" opacity=".4"/></svg>'
body+='<svg class="decision-lineart" viewBox="0 0 700 480" aria-hidden="true">'
for r in range(10):
    y=80+r*38
    body+=f'<path d="M 20 {y} Q 350 {y-190} 720 {y+30}" stroke="#7192A5" stroke-width="1.4" fill="none"/>'
body+='</svg>'
body+='<div class="decision-title">'+e('Не утвердить бюджет.','serif white')+e('Определить выбор.','serif-i','color:#C4DEFF')+'</div>'
body+='<div class="decision-items">'
for num,name,parts in [('01 / ПРИОРИТЕТЫ','Подтвердить направления',['Комиссии · ALM · операционная','эффективность без ставки на масштаб.']),
('02 / ФИНАНСЫ','Выбрать траекторию',['Прибыль с ограничениями по капиталу,','ликвидности и риск-аппетиту.']),
('03 / ИСПОЛНЕНИЕ','Назначить владельцев',['Экономика инициатив, сроки,','разовые затраты и ответственность.'])]:
    body+='<div class="decision-item"><div class="index">'+e(num)+'</div>'+e(name,'serif white','font-size:39px')+'<div class="copy">'+''.join(e(x) for x in parts)+'</div></div>'
body+='</div>'
wrap(7,body,'Определить выбор',True,'СТРАТЕГИЧЕСКАЯ СЕССИЯ / ВЫХОД НА РЕШЕНИЕ')
print('Wrote',len(list(sd.glob('*.html'))),'freeform HTML slides')
