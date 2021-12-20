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


### ldoc Errors

ldoc templating is sadly exposing a tiny subset of lua methods so proper error handling is insanely hard. This leads to very hard debugging. Here's hints for some common errors.

#### Missing @param

If you get an error similar to this, with line numbers close to the ones here, you have probably documented a lua function but not put a `@param` or `@tparam` for one or more of its parameters in the `MODULE_NAME` module.

```
template failed for <MODULE_NAME>: [string "TMP"]:232: attempt to index a function value (field '?')
stack traceback:
	[string "TMP"]:232: in local 'f'
	[string "TMP"]:49: in global 'map'
	[string "TMP"]:229: in global 'method'
	[string "TMP"]:159: in global 'module'
	[string "TMP"]:315: in function <[string "TMP"]:1>
	[C]: in function 'xpcall'
```