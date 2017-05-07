# .macoscompose

this lets you write compose key config in a simple yaml-like format.

the setup is just like that on
[gnarf's osx-compose-key repo](https://github.com/gnarf/osx-compose-key) except
you don't need to download or install it, instead you can make a `.macoscompose`
file in your `$HOME` and populate it in a manner similar to this:

```yaml
+1: 👍
-1: 👎

# hearts
heart: ❤
"yellow heart": 💛

dog: 🐶
"(:": 🙃
```

then run `node .` in this directory (once you've `npm install`'d) and restart
the apps you want to use compose key in.

## something like this:

```sh
git clone https://gitlab.com/chee/macoscompose
cd macoscompose
cp example.macoscompose ~/.macoscompose
npm install
node .
```

## notes

merges with the current `DefaultKeyBinding.dict` if it exists, so it can be used
as an extension of `osx-compose-key`, or in combination with other bindings and
binding generators

## todo

* add more entries to the example
* add error handling
* fill out the rest of the todo section
