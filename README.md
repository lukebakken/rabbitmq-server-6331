Example demonstating [this issue](https://github.com/rabbitmq/rabbitmq-server/discussions/6331#discussioncomment-5796803).

Use it as follows:

1. `docker compose up -d --build`
1. `docker compose logs app --since=10m`