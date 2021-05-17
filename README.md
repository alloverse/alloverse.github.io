### Generating api docs

1. Install luarocks `brew install luarocks`
2. Install ldoc `luarocks install ldoc`
3. Shallow init the submodules that we want to make docs for `git submodule update --init`
4. Run `rvm use 2.7` to make sure the right version of Ruby is being used
5. Run ldoc: `~/.luarocks/bin/ldoc -l _generation -x .md -f markdown _generation/libs`
6. (Run the page locally to see the results: `bundle exec jekyll serve --livereload`)
