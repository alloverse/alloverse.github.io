### Generating api docs

1. Install luarocks `brew install luarocks`
2. Install ldoc `luarocks install ldoc`
3. Shallow init submodules to latest remote commit wheil skipping LFS files, that we want to make docs for `GIT_LFS_SKIP_SMUDGE=1 git submodule update --init --remote`
4. Run `rvm use 2.7` to make sure the right version of Ruby is being used
5. Run ldoc: `~/.luarocks/bin/ldoc -l _generation -x .md -f markdown _generation/libs`
6. (Run the page locally to see the results: `bundle exec jekyll serve --livereload`)
