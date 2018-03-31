{
  "targets": [
    {
      "target_name": "g8",
      "sources": [ ".g8/out.cc", ".g8/g8.cc" ],
      "libraries": ["<(module_root_dir)/.g8/out.so"],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
      ]
    }
  ]
}
