### Generating api docs

1. Install luarocks 
 - `brew install luarocks`
2. Install ldoc 
 - `luarocks install ldoc`
3. Shallow init submodules to latest remote commit wheil skipping LFS files, that we want to make docs for
 - `GIT_LFS_SKIP_SMUDGE=1 git submodule update --init --remote`
4. Delete the allonet bindeps folder that contains deps we don't want to generate deps for 
 - `rm -rf _generation/libs/allonet/bindeps`
5. Use Ruby 2.7 for ldoc
 - `rvm use 2.7`
6. Run ldoc
 - `~/.luarocks/bin/ldoc -l _generation -x .md -f markdown _generation/libs`
7. Preview locally
 - `bundle exec jekyll serve --livereload`
