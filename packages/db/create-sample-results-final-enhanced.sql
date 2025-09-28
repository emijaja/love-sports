-- 拡張されたサンプル最終結果データを作成するためのSQLスクリプト
-- イベント10000000-0000-0000-0000-000000000001の参加者に対する詳細結果

INSERT INTO public.results_final (
    event_id,
    generated_at_ms,
    per_participant_json
)
VALUES (
    '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
    extract(epoch from now()) * 1000,        -- 現在時刻（ミリ秒）
    '{
        "5bfbb02f-9757-4cd3-aa1b-55d466d01737": {
            "excitementRanking": [
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976"
            ],
            "heartRateRanking": [
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976"
            ],
            "proximityRanking": [
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386"
            ],
            "proximityDetails": {
                "95142252-1fcb-481c-bd8c-de2af051eca6": {
                    "averageDistance": 2.3,
                    "proximityTime": 42,
                    "minDistance": 0.8,
                    "distanceTimeline": [
                        {"time": "開始直後", "distance": 3.5},
                        {"time": "中盤", "distance": 2.2},
                        {"time": "最接近", "distance": 0.8},
                        {"time": "終盤", "distance": 2.5}
                    ]
                },
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd": {
                    "averageDistance": 3.1,
                    "proximityTime": 28,
                    "minDistance": 1.2
                },
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386": {
                    "averageDistance": 3.8,
                    "proximityTime": 16,
                    "minDistance": 1.5
                }
            },
            "excitementDetails": {
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386": {
                    "excitementLevel": "MAX",
                    "duration": 35,
                    "peakTime": "15:25"
                },
                "f11a6aae-7a38-4511-8c21-395e348cf521": {
                    "excitementLevel": "HIGH",
                    "duration": 22,
                    "peakTime": "15:18"
                },
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976": {
                    "excitementLevel": "MID",
                    "duration": 15,
                    "peakTime": "15:42"
                }
            },
            "heartRateDetails": {
                "peakHeartRate": 180,
                "peakTime": "15:47",
                "peakDistance": 1.5,
                "peakNearestParticipant": "f11a6aae-7a38-4511-8c21-395e348cf521",
                "heartRateTimeline": [
                    {"time": "15:45", "bpm": 153},
                    {"time": "15:46", "bpm": 165},
                    {"time": "15:47", "bpm": 180},
                    {"time": "15:48", "bpm": 158}
                ]
            }
        },
        "41c64b77-3dd7-4e20-8803-4dabfd3f4386": {
            "excitementRanking": [
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "25e8477e-c755-4039-aa40-d6878b76390e"
            ],
            "heartRateRanking": [
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "25e8477e-c755-4039-aa40-d6878b76390e"
            ],
            "proximityRanking": [
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737"
            ],
            "proximityDetails": {
                "25e8477e-c755-4039-aa40-d6878b76390e": {
                    "averageDistance": 1.9,
                    "proximityTime": 38,
                    "minDistance": 0.5
                }
            },
            "excitementDetails": {
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737": {
                    "excitementLevel": "MAX",
                    "duration": 28,
                    "peakTime": "15:32"
                }
            },
            "heartRateDetails": {
                "peakHeartRate": 172,
                "peakTime": "15:33",
                "peakDistance": 1.2,
                "peakNearestParticipant": "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "heartRateTimeline": [
                    {"time": "15:31", "bpm": 145},
                    {"time": "15:32", "bpm": 160},
                    {"time": "15:33", "bpm": 172},
                    {"time": "15:34", "bpm": 152}
                ]
            }
        },
        "95142252-1fcb-481c-bd8c-de2af051eca6": {
            "excitementRanking": [
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976"
            ],
            "heartRateRanking": [
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737"
            ],
            "proximityRanking": [
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976"
            ],
            "proximityDetails": {
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737": {
                    "averageDistance": 2.3,
                    "proximityTime": 42,
                    "minDistance": 0.8
                }
            },
            "excitementDetails": {
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd": {
                    "excitementLevel": "MAX",
                    "duration": 31,
                    "peakTime": "15:20"
                }
            },
            "heartRateDetails": {
                "peakHeartRate": 168,
                "peakTime": "15:21",
                "peakDistance": 1.8,
                "peakNearestParticipant": "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "heartRateTimeline": [
                    {"time": "15:19", "bpm": 140},
                    {"time": "15:20", "bpm": 155},
                    {"time": "15:21", "bpm": 168},
                    {"time": "15:22", "bpm": 148}
                ]
            }
        }
    }'::jsonb
);

-- 確認用クエリ
-- SELECT
--     event_id,
--     generated_at_ms,
--     jsonb_pretty(per_participant_json)
-- FROM public.results_final
-- WHERE event_id = '10000000-0000-0000-0000-000000000001';