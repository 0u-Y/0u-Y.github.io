---
title: "오픈소스 기록: 2026년 10월"
description: "Lighthouse와 Grandine에서 작업한 피어 처리, 검증, attestation packing, fallback 실행 클라이언트에 관한 기록입니다."
pubDatetime: 2026-11-02T04:57:28+09:00
category: open-source
format: monthly
draft: false
lang: ko
tags: [monthly, ethereum, lighthouse, grandine]
---

10월에는 Lighthouse와 Grandine 작업을 이어갔다. 피어 처리와 검증, attestation packing, fallback 실행 클라이언트를 다뤘다.

## Lighthouse

### [같은 finalized epoch에서 root가 충돌하는 피어 거부하기 #10288](https://github.com/sigp/lighthouse/pull/10288)

- 같은 finalized epoch에 대해 다른 root를 보고한 피어가 동기화 경로로 넘어갈 수 있는 문제를 수정했다.
- 기존 피어 수용 로직의 예외 처리는 유지하면서, `Status`에 이미 있는 체크포인트를 사용해 추가 데이터베이스 조회를 피했다.

### [RPC 배치에서 로컬 KZG 검증을 마친 Fulu column 재사용하기 #10363](https://github.com/sigp/lighthouse/pull/10363)

- 같은 column이 gossip과 RPC로 들어왔을 때 KZG 검증을 반복하지 않도록 작업했다.
- 재사용하려면 **로컬에서 모든 검증을 마쳤고, 내용이 정확히 일치해야 한다**. 캐시에 있다는 이유만으로 재사용하지는 않는다.
- 로컬 측정에서는 이점이 있었지만, 실제 노드에서 재사용할 수 있는 빈도와 노드 전체 성능에 미치는 효과는 아직 측정하지 못했다.

### [RPC 응답 압축에서 임시 버퍼 없애기 #10410](https://github.com/sigp/lighthouse/pull/10410)

- RPC 응답을 압축할 때 대상 버퍼에 바로 쓰도록 바꿔, 중간 메모리 할당과 복사를 없앴다.
- 기존 구현과 전체 출력 결과를 비교해 인코딩이 달라지지 않았는지 확인했다.

## Grandine

### [Gloas의 aggregate 단위 greedy attestation packing 구현 #1003](https://github.com/grandinetech/grandine/pull/1003)

- 한동안 미뤄뒀던 Gloas attestation packer 작업을 다시 시작했다.
- 최종적으로 블록에 들어갈 aggregate를 블록 한도 안에서 선택하는 **greedy baseline**을 구현했다.

Baseline을 마련했으니 다음은 최적화다. **Packing 품질과 실행 시간** 사이의 균형을 잡는 일이 쉽지는 않아 보인다. 어떤 접근이 실제로 도움이 되는지 알려면 관련 자료를 충분히 읽고 직접 측정하는 과정이 필요할 것 같다.

개인적으로는 이 과정이 기대된다. Attestation packing에 쓰이는 알고리즘을 더 깊이 공부하고, 그 아이디어가 실제 클라이언트에서도 잘 작동하는지 확인해볼 수 있을 것 같다.

### [Fallback 실행 클라이언트를 계속 갱신하기 #1024](https://github.com/grandinetech/grandine/pull/1024)

- 주 실행 클라이언트가 정상적으로 응답해도 fallback 클라이언트를 계속 갱신하도록 바꿨다. 주 클라이언트에 문제가 생기면 바로 전환할 수 있도록 준비해두기 위해서다.
- Geth 두 인스턴스를 띄워 동기화와 복구를 확인했다.
