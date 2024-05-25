# Gateway

The gateway is the entry point for the MisArch system.
It is responsible for routing requests to the correct service and handling authentication.
Requests are forwarded via dapr service invocation to the respective service.

## Documentation

Detailed information about the gateway can be found in the [documentation](https://misarch.github.io/docs/docs/dev-manuals/services/gateway).


## Getting started

Running the gatway on its own is not supported.
To run it in combination with the other services, please refer to https://github.com/misarch/infrastructure-docker.

## License

MisArch is [MIT licensed](LICENSE).