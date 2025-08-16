use std/log
export-env {
    use std/log []
}

export def build [] {
  if ("dist" | path exists) {
    rm -r dist
  }

  bun build index.html --outdir dist --public-path "/"
}

export def test [] {
	npm run test
}

export def nix-build [] {
  ^nix build
}

export def update [] {
  bun update

  let deps_info = (get-deps-info)
  {
    "deps": ($deps_info.hash),
    "package_lock": (open -r bun.lock | hash sha256)
  } | to toml | save -f hashes.toml
  ^nix flake update
}

def get-deps-info [] {
  let pwd = $env.PWD
  let temp_path = $"/tmp/snapshot_browser_webapp_deps_(random uuid)"
  # rm -r node_modules
  mkdir $temp_path

  cp package.json $temp_path
  cp bun.lock $temp_path

  cd $temp_path
  bun install --frozen-lockfile
  cd $pwd
  # cp -r node_modules $temp_path

  rm $"($temp_path)/package.json"
  rm $"($temp_path)/bun.lock"

  let node_modules_cache = $"($temp_path)/node_modules/.cache"

  if ($node_modules_cache | path exists) {
    rm -r $node_modules_cache
  }

	let deps_info = {
		hash: (nix hash path $temp_path)
	}

  # rm -r $temp_path

  $deps_info
}

# export def start [
#   use_result: bool = false
# ] {
#   if ("dist" | path exists) {
#     rm -r dist
#   }

#   bun build index.html --outdir dist
#   let root_path = (if $use_result { $"($env.PWD)/result" } else { $env.PWD })
#   # docker run --rm -p 8080:80 --link travel-manager-couchdb:couchdb -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
#   docker run --rm -p 8888:80 -p 8080:8080 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($root_path)/dist:/usr/share/nginx/html:ro" nginx:alpine
# }

export def rebuild [] {
  build
  start
}

export def start [
  use_result: bool = false
] {
  # build
  let root_path = (if $use_result { $"($env.PWD)/result" } else { $env.PWD })

  # let network_name = "snapshot-browser-network"
  # let network = (docker network ls --format json --filter $"name=($network_name)" | from json)

  # if $network == null {
  #   log info "creating network"
  #   docker network create --driver bridge $network_name
  # } else {
  #   log info "network already exists"
  # }

  # let api_name = "snapshot-browser-api"
  # let api = (docker ps --filter $"name=($api_name)" --format json -a | from json)

  # if $api == null {
  #   log info "creating api container"
  #   docker run -d --network $network_name -p 8080:8080 --name $api_name -v "/home/hannes/Repository/snapshot-browser-api:/opt/api" -v "/opt/hannes/cargo_target/debug:/opt/debug" -e SNAPSHOT_CONFIG_PATH=./test_config.json -e ROCKET_PORT=8080 -e ROCKET_ADDRESS=127.0.0.1 debian:stable-slim bash -c "cd /opt/api && /opt/debug/snapshot-browser-api"
  # } else if $api.state != "running" {
  #   log info "starting api container"
  #   docker start $api_name
  # } else {
  #   log info "api container already running"
  # }

  let server_name = "snapshot-browser-server"
  let server = (docker ps --filter $"name=($server_name)" --format json -a | from json)

  if $server == null {
    log info "creating server container"
    docker run -d --network host --name $server_name -p 8888:80 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($root_path)/dist:/usr/share/nginx/html:ro" nginx:alpine
    # docker run -d --network $network_name --name $server_name -p 8888:80 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($root_path)/dist:/usr/share/nginx/html:ro" nginx:alpine
  } else if $server.state != "running" {
    log info "starting server container"
    docker start $server_name
  } else if $server.state == "running" {
    log info "server container already running => restarting"
    docker restart $server_name
  }
}

export def stop [] {
  remove_container "snapshot-browser-server"
  remove_container "snapshot-browser-api"
  remove_network "snapshot-browser-network"
}

def remove_container [
  container: string
] {
  let server = (docker ps --filter $"name=($container)" --format json -a | from json)

  if ($server != null) {
    if $server.state == "running" {
      log info $"stopping container '($container)'"
      docker stop $container
    }

    log info $"removing container '($container)'"
    docker rm $container
  }
}

def remove_network [
  network: string
] {
  if (docker network ls --format json --filter $"name=($network)" | from json) != null {
    log info "removing network"
    docker network rm $network
  }
}

export def create-test-container [] {
  sudo nixos-container create sb-wa-test --flake .#sb-wa-test
  sudo nixos-container start sb-wa-test
}

export def update-test-container [] {
  sudo nixos-container update sb-wa-test --flake .#sb-wa-test
}

export def destroy-test-container [] {
  let messed_up_path = "/var/lib/nixos-containers/sb-wa-test/var/empty"
  
  if ($messed_up_path | path exists) {
    sudo chattr -i $messed_up_path
    # sudo rm -rf $messed_up_path
  }
  
  sudo nixos-container destroy sb-wa-test
}
