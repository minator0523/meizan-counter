let informationStateId = null; // ポップアップのインスタンスを保持する変数
let mountainId = null;

const updatePoi = async (id, name, longitude, latitude, elevation, count) => {
    const response = await fetch(
        `http://localhost:3000/pois/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "longitude": longitude,
                "latitude": latitude,
                "name": name,
                "elevation": elevation, 
                "count": count,
            }),
        },
    );
    await loadPoi();
    //reloadPoi();
    alert('更新しました');
};


const map = new maplibregl.Map({
    hash: true,
    container: 'map', // container id
    renderWorldCopies: false,
    style: {
        version: 8,
        sources: {
            gsistd: {
                type: 'raster',
                tiles: [
                    'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution: '地理院タイル',
            },
            poi: {
                type: 'geojson',
                "promoteId": "id",
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            },
        },
        layers: [
            {
                id: 'gsistd',
                type: 'raster',
                source: 'gsistd',
            },
            {
                id: 'poi',
                type: 'circle',
                source: 'poi',
                paint: {
                    'circle-color': [
                        'case',
                        ['==', ['get', 'count'], 0], 'rgba(100,100,100,0.8)',
                        ['==', ['get', 'count'], 1], 'rgba(255,241,0,0.8)',
                        ['==', ['get', 'count'], 2], 'rgba(243,152,0,0.8)', 
                        'rgba(230,0,18,0.8)', 
                    ],
                    'circle-radius': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        20.0,
                        7.5,
                    ],
                    'circle-stroke-width': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        4,
                        2,
                    ],
                    'circle-stroke-color': 'black',
                },
            },
        ],
    },
});
const loadPoi = async () => {
    // 地図の範囲を取得
    const bounds = map.getBounds();
    const minx = Math.max(bounds.getWest(), -179);
    const miny = Math.max(bounds.getSouth(), -85);
    const maxx = Math.min(bounds.getEast(), 179);
    const maxy = Math.min(bounds.getNorth(), 85);

    const response = await fetch(
        `http://localhost:3000/pois_sql2?bbox=${minx},${miny},${maxx},${maxy}`,
    );
    const data = await response.json();
    map.getSource('poi').setData(data);
};
map.on('load', async () => await loadPoi()); // 初期ロード
map.on('load', async () => await clearInfo()); // 初期ロード
map.on('moveend', async () => await loadPoi()); // マップの移動完了時に画面範囲の地物を取得
map.on('click', (e) => {
    if (informationStateId !== null) {
        // ポップアップが表示されている場合は削除するだけ
        mountainHoverOff(mountainId);
        clearInfo();

        mountainId = null;
        return;
    }

    // クリックした位置に地物があるかどうかを取得
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['poi'],
    });

    if (features.length === 0) {
        clearInfo();
        mountainHoverOff(mountainId);
        return ;

    } else {
        // 地物がある場合
        const feature = features[0];
        const name = feature.properties.name;
        let count = feature.properties.count
        const elevation = feature.properties.elevation
        const longitude = e.lngLat.lng;
        const latitude = e.lngLat.lat;
        mountainId = feature.properties.id
        mountainHoverOn(mountainId);
        var informationTag = document.getElementById("information");
        informationTag.innerHTML = 
            `
                山名：<b>${name}</b><br>
                標高[m]：<b>${elevation}</b><br>
                <label>カウント：<input id=countForm type="number" size="40" value="${count}"></label>
                <button id="updateBtn" type="button" >更新</button>
            `;
        showInfo();

        // 更新ボタン
        updateElement = document.getElementById('updateBtn'); 
        countElement = document.getElementById('countForm'); 

        updateElement.onclick = async () => {
            count = countElement.value;
            if (!confirm('更新しますか？')) return;
            await updatePoi(feature.properties.id, name, longitude, latitude, elevation, count);
        };

    }
});


// 山の情報をクリア
const clearInfo = () => {
    $('.info').hide();
    if (informationStateId) {
        informationStateId = null;
    }
};


// 山の情報を表示
const showInfo = () => {
    $('.info').show();
    if (!informationStateId) {
        informationStateId = true;
    }
};


// 山頂の強調表示ON
const mountainHoverOn = (mountainId) => {
    map.setFeatureState(
        {source: 'poi', id: mountainId},
        {hover: true}
    );
};


// 山頂の強調表示OFF
const mountainHoverOff = (mountainId) => {
    map.setFeatureState(
        {source: 'poi', id: mountainId},
        {hover: false}
    );
};

