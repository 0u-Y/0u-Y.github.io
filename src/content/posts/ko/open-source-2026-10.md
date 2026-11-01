---
title: "오픈소스 기록: 2026년 10월"
description: "Lighthouse와 Grandine에서 진행한 피어 처리와 검증, attestation packing, fallback 실행 클라이언트 작업을 정리했습니다."
pubDatetime: 2026-11-02T04:57:28+09:00
category: open-source
format: monthly
draft: false
lang: ko
tags: [monthly, ethereum, lighthouse, grandine]
---

10월에는 Lighthouse와 Grandine에 기여했다. 피어 처리와 검증, attestation packing, fallback 실행 클라이언트 관련 작업을 진행했다.

## Lighthouse

### [finalized epoch는 같지만 root가 다른 피어 거부하기 #10288](https://github.com/sigp/lighthouse/pull/10288)

- finalized epoch는 같지만 root가 다른 피어도 동기화 단계로 넘어갈 수 있던 문제를 수정했다.
- 연결을 허용하는 기존 예외 조건은 유지했다. 체크포인트는 `Status`에 있는 값을 써서 DB를 추가로 조회하지 않도록 했다.

### [RPC 배치에서 로컬 KZG 검증을 마친 Fulu column 재사용하기 #10363](https://github.com/sigp/lighthouse/pull/10363)

- 같은 column을 gossip과 RPC로 받았을 때 KZG 검증을 반복하지 않도록 작업했다.
- **로컬 검증을 모두 통과하고 내용까지 정확히 일치한 경우에만 재사용한다**. 캐시에 있다는 것만으로는 충분하지 않다.
- 로컬 측정에서는 성능 개선을 확인했다. 실제 노드에서 얼마나 자주 재사용할 수 있는지와 노드 전체 성능에 미치는 영향은 아직 측정하지 못했다.

### [RPC 응답 압축에서 임시 버퍼 없애기 #10410](https://github.com/sigp/lighthouse/pull/10410)

- 압축한 RPC 응답을 최종 버퍼에 바로 쓰도록 바꿨다. 중간 버퍼를 할당하고 데이터를 복사하던 과정을 없앴다.
- 기존 구현과 출력 전체를 비교해 인코딩 결과가 달라지지 않았는지 확인했다.

## Grandine

### [Gloas의 aggregate 단위 greedy attestation packing 구현 #1003](https://github.com/grandinetech/grandine/pull/1003)

- 한동안 미뤄뒀던 Gloas attestation packer 작업을 다시 시작했다.
- 블록에 실제로 들어갈 aggregate를 기준으로 블록 한도에 맞춰 선택하는 **greedy baseline**을 구현했다.

Baseline은 마련했으니 이제 최적화를 해보려고 한다. **Packing 품질과 실행 시간**을 함께 챙겨야 해서 쉽지는 않아 보인다. 관련 자료를 충분히 읽고 직접 측정해보면서 어떤 방법이 효과가 있는지 살펴볼 생각이다.

이 과정은 꽤 재미있을 것 같다. Attestation packing 알고리즘을 더 깊이 공부하고 실제 클라이언트에서도 효과가 있는지 확인해보고 싶다.

### [Fallback 실행 클라이언트도 계속 갱신하기 #1024](https://github.com/grandinetech/grandine/pull/1024)

- 기본 실행 클라이언트가 정상적으로 응답하더라도 fallback 클라이언트를 계속 갱신하도록 바꿨다. 문제가 생기면 fallback으로 바로 전환할 수 있어야 하기 때문이다.
- Geth 인스턴스 두 개를 띄워 동기화와 복구가 제대로 되는지 확인했다.
