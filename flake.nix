{
  description = "A WebApp for browsing snapshots";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;
      };

      snapshot-browser-package-json = (builtins.fromJSON (builtins.readFile ./package.json));
      hashes-toml = (builtins.fromTOML (builtins.readFile ./hashes.toml));

      snapshot-browser-deps = derivation {
        inherit system;
        name = "${snapshot-browser-package-json.name}-${hashes-toml.package_lock}-deps";
        builder = "${pkgs.nushell}/bin/nu";
        buildInputs = with pkgs; [
          # nodejs_24
          # bash
          # rust-bin-custom
          # uutils-coreutils-noprefix
          gnutar
          bun
        ];
        args = [ ./builder.nu "vendor" ./. ];

        outputHashAlgo = "sha256";
        outputHashMode = "recursive";
        outputHash = hashes-toml.deps;
        # outputHash = pkgs.lib.fakeHash;
      };

      snapshot-browser-webapp = derivation {
        inherit system;
        name = "${snapshot-browser-package-json.name}-v${snapshot-browser-package-json.version}";
        builder = "${pkgs.nushell}/bin/nu";
        buildInputs = with pkgs; [
          # nodejs_24
          # bash
          # uutils-coreutils-noprefix
          uutils-coreutils
          gnutar
          # diffutils
          bun
        ];
        args = [ ./builder.nu "build" ./. snapshot-browser-deps ];
      };
    in {
      packages.${system} = {
        deps = snapshot-browser-deps;
        webapp = snapshot-browser-webapp;
        default = snapshot-browser-webapp;
      };

      devShells.${system}.default = pkgs.mkShell {
        name = "snapshot-browser-webapp";

        shellHook = ''
          exec nu
        '';
        # Additional dev-shell environment variables can be set directly
        # MY_CUSTOM_DEVELOPMENT_VAR = "something else"
        # Extra inputs can be added here; cargo and rustc are provided by default.
        buildInputs = with pkgs; [
          nushell
          # nodejs_24
          # uutils-coreutils-noprefix
          busybox
          bun
        ];
      };

      nixosConfigurations = {
        sb-wa-test = nixpkgs.lib.nixosSystem {
          inherit system;

          modules = [
            # self.nixosModules.${system}.default
            ({pkgs, ...}: {
              nixpkgs.overlays = [
                (final: prev: { snapshot-browser-webapp = self.packages.${system}.default; })
              ];
              # Only allow this to boot as a container
              boot.isContainer = true;
              networking.hostName = "sb-wa-test";

              environment.systemPackages = with pkgs; [
                snapshot-browser-webapp
              ];

              system.stateVersion = "25.05";
            })
          ];
        };
      };
    };
  
  nixConfig = {
    substituters = [
      "https://cache.nixos.org"
      "https://hannes-hochreiner.cachix.org"
    ];
    trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "hannes-hochreiner.cachix.org-1:+ljzSuDIM6I+FbA0mdBTSGHcKOcEZSECEtYIEcDA4Hg="
    ];
  };
}