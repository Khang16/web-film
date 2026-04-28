# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


# Làm việc với docker

up = Bật project

down = Tắt và xóa project

stop = Tắt tạm

start = Mở lại

- khi clone code về cần chạy câu lệnh sau để chạy project: docker compose -f docker/docker-compose.dev.yml up --build
- mở docker-desktop ra xem và tắt/bật

- Chỉ tắt máy/ tắt docker desktop:
  Cách 1 (dễ nhất)
  - Vào Docker Desktop → bấm Start container.
  Cách 2
  - Chạy: docker compose -f docker/docker-compose.dev.yml up (ko cẫn build)
- Nếu đã chạy docker compose down
  Lúc này container đã bị xoá.
  => Bắt buộc phải chạy lại: docker compose -f docker/docker-compose.dev.yml up

- khi cài thư viện mới: docker compose -f docker/docker-compose.dev.yml exec frontend npm install "library mình muốn"
- khi muốn gỡ thư viện: docker compose -f docker/docker-compose.dev.yml exec frontend npm uninstall "library mình muốn"
- dev khác khi pull code có thư viện mới về cần thực thi 2 câu lệnh sau:
  - docker compose -f docker/docker-compose.dev.yml down (Stop + xóa container)
  - docker compose -f docker/docker-compose.dev.yml up --build (Tạo + chạy container)