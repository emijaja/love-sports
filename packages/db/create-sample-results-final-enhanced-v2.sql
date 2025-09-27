-- サンプル最終結果データを作成するためのSQLスクリプト（enhanced版 v2）
-- excitement-detailsで必要な追加フィールドを含む

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
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "f973591a-5c75-4d5d-9a18-14643d7772e3"
            ],
            "heartRateRanking": [
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd"
            ],
            "proximityRanking": [
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd",
                "41c64b77-3dd7-4e20-8803-4dabfd3f4386",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "25e8477e-c755-4039-aa40-d6878b76390e"
            ],
            "proximityDetails": {
                "95142252-1fcb-481c-bd8c-de2af051eca6": {
                    "averageDistance": 2.3,
                    "proximityTime": 42,
                    "minDistance": 0.8,
                    "distanceTimeline": [
                        {"time": "15:00", "distance": 3.5},
                        {"time": "15:15", "distance": 2.2},
                        {"time": "15:30", "distance": 0.8},
                        {"time": "15:45", "distance": 2.5}
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
                "maxHeartRate": 180,
                "peakTime": "15:47",
                "peakDistance": 1.5,
                "minDistance": 1.5,
                "peakNearestParticipant": "f11a6aae-7a38-4511-8c21-395e348cf521",
                "normalHeartRate": 72,
                "averageDistance": 5.2,
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
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd"
            ],
            "heartRateRanking": [
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd"
            ],
            "proximityRanking": [
                "25e8477e-c755-4039-aa40-d6878b76390e",
                "f11a6aae-7a38-4511-8c21-395e348cf521",
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737",
                "c789dfdb-f72c-4989-9cc3-8fdc374c0976",
                "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "95142252-1fcb-481c-bd8c-de2af051eca6",
                "f7a3207c-6b34-4bd3-909b-321ee119c5bd"
            ],
            "excitementDetails": {
                "5bfbb02f-9757-4cd3-aa1b-55d466d01737": {
                    "excitementLevel": "HIGH",
                    "duration": 28,
                    "peakTime": "15:20"
                }
            },
            "heartRateDetails": {
                "peakHeartRate": 175,
                "maxHeartRate": 175,
                "peakTime": "15:35",
                "peakDistance": 2.1,
                "minDistance": 2.1,
                "peakNearestParticipant": "f973591a-5c75-4d5d-9a18-14643d7772e3",
                "normalHeartRate": 68,
                "averageDistance": 4.8
            }
        }
    }'::jsonb
)
ON CONFLICT (event_id) DO UPDATE SET
    generated_at_ms = excluded.generated_at_ms,
    per_participant_json = excluded.per_participant_json;