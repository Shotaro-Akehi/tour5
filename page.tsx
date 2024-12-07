"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { touristSpots } from '../../data/prefectures';

// カスタムアイコンのHTMLテンプレートを生成
const createCustomIcon = (imageUrl: string) => {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;">
      <img
        src="${imageUrl}"
        style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; position: absolute; top: 4px; left: 4px; z-index: 2;"
        alt="観光地"
      />
      <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 15px solid red; position: absolute; bottom: -12px; z-index: 1;"></div>
      <div style="width: 50px; height: 50px; background-color: red; border-radius: 50%; position: absolute; z-index: 0;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    iconSize: [50, 50], // アイコン全体のサイズ
    iconAnchor: [25, 50], // ピンの先端を基準とする
    popupAnchor: [0, -50], // ポップアップの位置
    className: "custom-icon", // カスタムクラス
  });
};

const TouristRoutePage = () => {
  const ishikawaSpots = touristSpots['石川県'];

  // 下から7つの観光地を取得
  const last7Spots = ishikawaSpots.slice(-7);

  // ルート保存処理
  const saveRoute = () => {
    const routeToSave = last7Spots.map((spot) => ({
      name: spot.name,
      coordinates: spot.coordinates,
    }));
    localStorage.setItem('savedRoute', JSON.stringify(routeToSave));
    alert('ルートが保存されました！');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">観光ルート選択</h1>
      <p className="mb-4 text-gray-600">以下の観光地を結ぶルートを表示しています。</p>
      <div className="mb-4">
        <button
          onClick={saveRoute}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
        >
          ルートを保存
        </button>
      </div>
      <MapContainer
        center={[36.561325, 136.662494]} // 地図の初期中心
        zoom={11}
        style={{ height: '500px', width: '100%' }}
      >
        {/* タイルレイヤー */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* マーカーを表示 */}
        {last7Spots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.coordinates}
            icon={createCustomIcon(spot.image)}
          >
            <Popup>
              <h2>{spot.name}</h2>
              <p>{spot.description}</p>
            </Popup>
          </Marker>
        ))}

        {/* 選択されたルートを描画 */}
        <Polyline positions={last7Spots.map((spot) => spot.coordinates)} color="blue" />
      </MapContainer>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">ルートに含まれる観光地</h2>
        <ul className="list-disc list-inside mt-2">
          {last7Spots.map((spot, index) => (
            <li key={index}>{spot.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TouristRoutePage;
