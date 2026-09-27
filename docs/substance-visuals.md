# 物质外观与接龙牌池

背景色是低饱和度的视觉提示，不是精确色度。无色物质使用中性灰蓝作可见轮廓，不表示物质本身为蓝色。按约 20–25°C、常压下纯物质的状态映射；未核实的物质和单原子解套恢复中性背景。不得把溶液、火焰或蒸气的颜色套给固体。自定配方暂不自动推断状态。

核对资料：
- [RSC 元素周期表](https://periodic-table.rsc.org/)：元素的室温状态与外观。
- [溴](https://periodic-table.rsc.org/element/35/bromine)：红棕色液体。
- [碘，滑铁卢大学](https://uwaterloo.ca/chemistry/community-outreach/periodic-table-project/iodine)：有金属光泽的灰色固体。
- [NOAA 高锰酸钾](https://m.cameochemicals.noaa.gov/chris/PTP.pdf)：深紫色晶体。
- [NOAA 硫酸铜](https://cameochemicals.noaa.gov/chemical/3025)：注意无水物与五水合物的区别；本次只映射五水合物为蓝色。
- [NOAA 铜氨盐](https://cameochemicals.noaa.gov/chris/CSN.pdf)：深蓝色固体。

接龙使用单独的 1800 张池，A 的权重保持原样。先统计内置多元素物质对每种元素的覆盖：没有配方的元素权重为 0；稀有气体权重乘 0.3；其他元素乘 min(1,配方数/8)。使用最大余数法分配整数张数，极小权重可能舍入为 0。随机和配方混合都从此池取牌。房间自定配方不改变抽牌概率。这是减少难接牌的启发式，不保证每手都能接。

退出房间会终止当前局，并清除牌局后再移除座位，避免手牌与座位索引错位。正常获胜后的快照才会附带 revealedHands；中途退出不公开手牌。


## 本次扩充的核对资料

采用纯物质常温下的常见外观；同素异形体、晶型、杂质和氧化可能造成差别。没有按分子式给所有有机物推断状态，而是使用名称与化学式共同匹配，尤其区分乙醇/二甲醚、正戊烷/新戊烷。

- [NIOSH 乙醇](https://www.cdc.gov/niosh/npg/npgd0262.html)、[NOAA 二甲醚](https://cameochemicals.noaa.gov/report?key=CH585)：同分子式的液体与气体。
- [NCBI 重铬酸钾](https://www.ncbi.nlm.nih.gov/mesh/68011192)、[NOAA 铬酸钾](https://cameochemicals.noaa.gov/report?key=CH4300)：橙红和黄色晶体。
- [PubChem 三氧化二铬](https://pubchem.ncbi.nlm.nih.gov/compound/Chromic-oxide)、[PubChem 硫化镉](https://pubchem.ncbi.nlm.nih.gov/compound/Cadmium-Sulfide)：绿色和黄色固体。
- [IARC 钴化合物](https://www.ncbi.nlm.nih.gov/books/NBK506968/)：六水合氯化钴粉红至红色。
- [ATSDR 苯酚](https://wwwn.cdc.gov/TSP/PHS/PHS.aspx?phsid=146&toxid=27)、[ATSDR 萘](https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=239&toxid=43)：纯物质的浅色固体外观。
- [ATSDR 硝基苯](https://www.atsdr.cdc.gov/toxguides/toxguide-140.pdf)：无色至淡黄色液体。
- [NCBI 丙酮](https://www.ncbi.nlm.nih.gov/books/NBK590394/?report=reader)、[PubChem 二氧化硫](https://pubchem.ncbi.nlm.nih.gov/compound/Sulfur-Dioxide)：无色液体与无色气体。
- 其余常见元素参照前述 RSC 周期表；白色盐类采用中性背景，不借用其溶液或焰色。

## 材质细分

126 种物质，8 类视觉材质：气体、液体、黏稠液体、液态金属、固态金属、晶体、粉末、石墨层纹。纹理是外观示意，不表示真实生成反应、沉淀过程或晶体的精确结构。甘油采用更慢的流动节奏；汞为银色液滴；金、铜的高光色有区别。手机最多显示 6 个背景图形；减少动态效果时全部静止。

新增颜色资料：[绿矾](https://pubchem.ncbi.nlm.nih.gov/compound/62662)、[七水硫酸镍](https://cameochemicals.noaa.gov/chemical/4031)、[氧化亚铜（NIST）](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir6233.pdf)、[氢氧化铜（RSC）](https://pubs.rsc.org/en/content/articlepdf/2020/tb/d0tb01476a)。其余新增无色有机液体与白色盐类保持中性色，不引入溶液或焰色。

## 完整背景清单（126 种）

| 物质 | 化学式 | 常温外观 | 材质 |
| --- | --- | --- | --- |
| 氢气 | H2 | 无色气体 | gas |
| 氦气 | He | 无色气体 | gas |
| 石墨 | C | 灰黑色固体 | graphite |
| 氮气 | N2 | 无色气体 | gas |
| 氧气 | O2 | 无色气体 | gas |
| 氖气 | Ne | 无色气体 | gas |
| 钠 | Na | 银白色金属 | metal |
| 镁 | Mg | 银白色金属 | metal |
| 铝 | Al | 银白色金属 | metal |
| 环八硫 | S8 | 黄色晶体 | crystal |
| 氯气 | Cl2 | 黄绿色气体 | gas |
| 氩气 | Ar | 无色气体 | gas |
| 钾 | K | 银白色金属 | metal |
| 钙 | Ca | 银灰色金属 | metal |
| 钛 | Ti | 银灰色金属 | metal |
| 铬 | Cr | 银白色金属 | metal |
| 铁 | Fe | 银灰色金属 | metal |
| 镍 | Ni | 银白色金属 | metal |
| 铜 | Cu | 紫红色金属 | metal |
| 锌 | Zn | 蓝白色金属 | metal |
| 溴 | Br2 | 红棕色液体 | liquid |
| 氪气 | Kr | 无色气体 | gas |
| 银 | Ag | 银白色金属 | metal |
| 锡 | Sn | 银白色金属 | metal |
| 碘 | I2 | 灰黑色晶体 | crystal |
| 氙气 | Xe | 无色气体 | gas |
| 钨 | W | 灰白色金属 | metal |
| 铂 | Pt | 银白色金属 | metal |
| 金 | Au | 金色金属 | metal |
| 汞 | Hg | 银白色液态金属 | mercury |
| 铅 | Pb | 蓝灰色金属 | metal |
| 水 | H2O | 无色液体 | liquid |
| 氨 | NH3 | 无色气体 | gas |
| 硫化氢 | H2S | 无色气体 | gas |
| 六氟化硫 | SF6 | 无色气体 | gas |
| 一氧化碳 | CO | 无色气体 | gas |
| 二氧化碳 | CO2 | 无色气体 | gas |
| 一氧化氮 | NO | 无色气体 | gas |
| 一氧化二氮 | N2O | 无色气体 | gas |
| 二氧化硫 | SO2 | 无色气体 | gas |
| 氧化镁 | MgO | 白色固体 | powder |
| 氧化钙 | CaO | 白色固体 | powder |
| 氧化铝 | Al2O3 | 白色固体 | powder |
| 氧化铁 | Fe2O3 | 红棕色固体 | powder |
| 四氧化三铁 | Fe3O4 | 黑色固体 | powder |
| 氧化亚铜 | Cu2O | 砖红色固体 | powder |
| 氧化铜 | CuO | 黑色固体 | powder |
| 氧化锌 | ZnO | 白色固体 | powder |
| 二氧化钛 | TiO2 | 白色固体 | powder |
| 三氧化二铬 | Cr2O3 | 绿色固体 | powder |
| 二氧化锰 | MnO2 | 棕黑色固体 | powder |
| 硼酸 | H3BO3 | 白色晶体 | crystal |
| 氢氧化钠 | NaOH | 白色固体 | powder |
| 氢氧化钾 | KOH | 白色固体 | powder |
| 氢氧化镁 | Mg(OH)2 | 白色固体 | powder |
| 氢氧化钙 | Ca(OH)2 | 白色固体 | powder |
| 氢氧化铝 | Al(OH)3 | 白色固体 | powder |
| 氢氧化铜 | Cu(OH)2 | 蓝色固体 | powder |
| 氯化钠 | NaCl | 白色晶体 | crystal |
| 氯化钾 | KCl | 白色晶体 | crystal |
| 溴化钠 | NaBr | 白色晶体 | crystal |
| 溴化钾 | KBr | 白色晶体 | crystal |
| 碘化钠 | NaI | 白色晶体 | crystal |
| 碘化钾 | KI | 白色晶体 | crystal |
| 氯化银 | AgCl | 白色固体 | powder |
| 溴化银 | AgBr | 淡黄色固体 | powder |
| 碘化银 | AgI | 黄色固体 | powder |
| 碳酸钠 | Na2CO3 | 白色固体 | powder |
| 碳酸氢钠 | NaHCO3 | 白色固体 | powder |
| 碳酸钙 | CaCO3 | 白色固体 | powder |
| 硝酸钠 | NaNO3 | 无色至白色晶体 | crystal |
| 硝酸钾 | KNO3 | 无色至白色晶体 | crystal |
| 硝酸银 | AgNO3 | 无色晶体 | crystal |
| 高锰酸钾 | KMnO4 | 深紫色晶体 | crystal |
| 重铬酸钾 | K2Cr2O7 | 橙红色晶体 | crystal |
| 铬酸钾 | K2CrO4 | 黄色晶体 | crystal |
| 硫化镉 | CdS | 黄色固体 | powder |
| 硫氰酸钾 | KSCN | 无色至白色晶体 | crystal |
| 胆矾 | CuSO4·5H2O | 蓝色晶体 | crystal |
| 绿矾 | FeSO4·7H2O | 浅蓝绿色晶体 | crystal |
| 石膏 | CaSO4·2H2O | 无色至白色晶体 | crystal |
| 明矾 | KAl(SO4)2·12H2O | 无色晶体 | crystal |
| 大苏打 | Na2S2O3·5H2O | 无色晶体 | crystal |
| 七水硫酸镁 | MgSO4·7H2O | 无色至白色晶体 | crystal |
| 六水合氯化钴 | CoCl2·6H2O | 粉红至红色晶体 | crystal |
| 七水硫酸镍 | NiSO4·7H2O | 绿色晶体 | crystal |
| 一水合硫酸四氨合铜 | Cu(NH3)4SO4·H2O | 深蓝色晶体 | crystal |
| 甲烷 | CH4 | 无色气体 | gas |
| 甲醇 | CH4O | 无色液体 | liquid |
| 甲酸 | CH2O2 | 无色液体 | liquid |
| 乙烷 | C2H6 | 无色气体 | gas |
| 乙烯 | C2H4 | 无色气体 | gas |
| 乙炔 | C2H2 | 无色气体 | gas |
| 乙醇 | C2H6O | 无色液体 | liquid |
| 乙酸 | C2H4O2 | 无色液体 | liquid |
| 丙烷 | C3H8 | 无色气体 | gas |
| 丙烯 | C3H6 | 无色气体 | gas |
| 1-丙醇 | C3H8O | 无色液体 | liquid |
| 正丁烷 | C4H10 | 无色气体 | gas |
| 1-丁醇 | C4H10O | 无色液体 | liquid |
| 正戊烷 | C5H12 | 无色液体 | liquid |
| 正己烷 | C6H14 | 无色液体 | liquid |
| 正庚烷 | C7H16 | 无色液体 | liquid |
| 正辛烷 | C8H18 | 无色液体 | liquid |
| 异丁烷 | C4H10 | 无色气体 | gas |
| 新戊烷 | C5H12 | 无色气体 | gas |
| 异丙醇 | C3H8O | 无色液体 | liquid |
| 乙醚 | C4H10O | 无色液体 | liquid |
| 二甲醚 | C2H6O | 无色气体 | gas |
| 丙酮 | C3H6O | 无色液体 | liquid |
| 乙酸乙酯 | C4H8O2 | 无色液体 | liquid |
| 乙酸甲酯 | C3H6O2 | 无色液体 | liquid |
| 乙二醇 | C2H6O2 | 无色液体 | liquid |
| 丙三醇 | C3H8O3 | 无色液体 | viscous |
| 丁二酸 | C4H6O4 | 白色晶体 | crystal |
| 尿素 | CH4N2O | 白色晶体 | crystal |
| 甘氨酸 | C2H5NO2 | 白色晶体 | crystal |
| 丙氨酸 | C3H7NO2 | 白色晶体 | crystal |
| 乙腈 | C2H3N | 无色液体 | liquid |
| 苯 | C6H6 | 无色液体 | liquid |
| 环己烷 | C6H12 | 无色液体 | liquid |
| 甲苯 | C7H8 | 无色液体 | liquid |
| 苯酚 | C6H6O | 无色至白色晶体 | crystal |
| 硝基苯 | C6H5NO2 | 无色至淡黄色液体 | liquid |
| 苯甲酸 | C7H6O2 | 白色晶体 | crystal |
| 萘 | C10H8 | 白色晶体 | crystal |
