FROM messense/cargo-zigbuild AS builder

RUN apt update 
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y cmake
RUN apt-get install -y sqlite3

ENV USER=mqtt-sqlite-server
ENV UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"

COPY ./ .

RUN cargo zigbuild --target x86_64-unknown-linux-musl --release

FROM alpine

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /data

RUN chown -R mqtt-sqlite-server /data
RUN chmod 755 /data

COPY --from=builder /target/x86_64-unknown-linux-musl/release /data

USER mqtt-sqlite-server

CMD ["/data/mqtt-sqlite-server"]