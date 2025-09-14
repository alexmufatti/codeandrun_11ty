---js
const eleventyNavigation = {
	key: "Running",
	order: 2
};
---

# Statistiche

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    text-align: left;
  }
  th, td {
    padding: 12px;
    border: 1px solid #ddd;
  }
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
</style>

| Anno | Distanza | Dislivello | Attività |    Tempo |    Kudos |
|------|----------|------------|----------|----------|----------|
| 2025 |  1950 km |     9440 m |      141 | 159h 47m |      651 |
| 2024 |  3139 km |    14505 m |      227 | 257h 36m |      667 |
| 2023 |  1815 km |     8891 m |      159 | 154h  5m |     1085 |
| 2022 |  1928 km |     7633 m |      163 | 157h 50m |     1040 |
| 2021 |  1245 km |    25031 m |      107 | 116h 28m |      924 |
| 2020 |  1758 km |    19463 m |      146 | 144h 44m |      691 |
| 2019 |  1826 km |    20483 m |      158 | 155h 43m |      748 |
| 2018 |  2159 km |    21312 m |      172 | 183h 30m |      545 |
| 2017 |  1288 km |    17322 m |      131 | 115h 33m |      257 |
| 2016 |   802 km |     7935 m |       88 |  72h 17m |       84 |
| 2015 |   681 km |     6427 m |       74 |  59h 46m |        0 |
| 2014 |   618 km |     4048 m |       83 |  55h 32m |        0 |
| 2013 |   210 km |      868 m |       32 |  21h 53m |        0 |
| 2012 |   233 km |      976 m |       31 |  23h 23m |        0 |
| 2011 |    10 km |      216 m |        2 |   1h  3m |        0 |

_Aggiornato il 14/09/2025 alle 10:54:36_

# Record personali

| Distanza       |   Tempo | Passo       | Dove                                 | Anno |
|----------------|--------:|-------------|--------------------------------------|------|
| 5K             |   18:20 | 3:40 min/km | Test VDOT                            | 2024 |
| 10K            |   38:37 | 3:52 min/km | Cursa Diagonal                       | 2024 |
| Mezza Maratona | 1:25:37 | 4:04 min/km | Mitja Marató Costa Barcelona Maresme | 2024 |
| Maratona       | 3:06:11 | 4:25 min/km | TCS London Marathon                  | 2024 |

# Grafico delle Attività

<canvas id="activityChart" width="400" height="200"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  const ctx = document.getElementById('activityChart').getContext('2d');

const data = {"labels":["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],"datasets":[{"label":"2011","data":[0,0,0,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.6,9.6],"fill":false,"borderWidth":1,"borderColor":"#FFFFFF","backgroundColor":"#FFFFFF"},{"label":"2012","data":[6.7,6.7,6.7,6.7,6.7,6.7,6.7,21.7,123.4,178.5,226.5,233.5],"fill":false,"borderWidth":1,"borderColor":"#C0C0C0","backgroundColor":"#C0C0C0"},{"label":"2013","data":[78.6,118.1,161,168.9,174.9,174.9,181.9,181.9,202.8,209.9,209.9,209.9],"fill":false,"borderWidth":1,"borderColor":"#808080","backgroundColor":"#808080"},{"label":"2014","data":[0,14.1,65.4,75.2,116.9,199.5,292.1,383.5,464.5,549.7,604,618.2],"fill":false,"borderWidth":1,"borderColor":"#000000","backgroundColor":"#000000"},{"label":"2015","data":[50.8,50.8,50.8,50.8,66.1,147.3,240.3,340.9,409.1,509.9,599.2,680.7],"fill":false,"borderWidth":1,"borderColor":"#000080","backgroundColor":"#000080"},{"label":"2016","data":[22.6,38.2,92.6,166.5,236.1,268.3,341.1,458.5,551.4,656.7,751.4,802.5],"fill":false,"borderWidth":1,"borderColor":"#0000FF","backgroundColor":"#0000FF"},{"label":"2017","data":[108.5,229.2,310.3,427.1,576.6,642.3,716.2,817.9,856.1,1009.2,1178.3,1288.4],"fill":false,"borderWidth":1,"borderColor":"#00FFFF","backgroundColor":"#00FFFF"},{"label":"2018","data":[233.6,441.2,736,930.9,1052.9,1184.3,1285.4,1461,1603.9,1806.4,1966.9,2159],"fill":false,"borderWidth":1,"borderColor":"#008080","backgroundColor":"#008080"},{"label":"2019","data":[189,244.7,372.9,514.7,673.6,788.6,988.2,1146.2,1281.5,1499.6,1699.7,1826.1],"fill":false,"borderWidth":1,"borderColor":"#00FF00","backgroundColor":"#00FF00"},{"label":"2020","data":[211.9,503.4,672.6,772,873.1,916.9,1051,1191.3,1295.2,1446.7,1592.4,1757.5],"fill":false,"borderWidth":1,"borderColor":"#FF00FF","backgroundColor":"#FF00FF"},{"label":"2021","data":[171.7,312,460,575.9,702.5,859,1008.6,1140.2,1195,1236.6,1244.6,1244.6],"fill":false,"borderWidth":1,"borderColor":"#800080","backgroundColor":"#800080"},{"label":"2022","data":[30.3,177.5,370.8,555,727.6,858.6,1019.6,1131.7,1372.9,1574.9,1815.3,1927.8],"fill":false,"borderWidth":1,"borderColor":"#008000","backgroundColor":"#008000"},{"label":"2023","data":[136.6,167.2,285.1,413.6,605.7,670,861,1064.6,1243.1,1459.9,1627,1815.2],"fill":false,"borderWidth":1,"borderColor":"#808000","backgroundColor":"#808000"},{"label":"2024","data":[247.7,493.8,800.1,1037.1,1255.5,1518.6,1816.1,2075.7,2340.6,2599.6,2866.4,3139.3],"fill":false,"borderWidth":1,"borderColor":"#FFFF00","backgroundColor":"#FFFF00"},{"label":"2025","data":[238.8,444.2,737.5,1015.5,1173.3,1303,1529.8,1813.1,1949.6,null,null,null],"fill":false,"borderWidth":5,"borderColor":"red","backgroundColor":"red"}]};
  const activityChart = new Chart(ctx, {
    type: 'line',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
</script>

