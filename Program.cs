// http://pastebin.com/kMg4UkTn

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace CsprojOption
{
    class Program
    {
        static string PATH = @"D:\dev";

        static void CheckDebugOptimization(string path)
        {
            string s;
            var encoding = Encoding.UTF8;
            using (var reader = new StreamReader(path, true))
            {
                s = reader.ReadToEnd();
                encoding = reader.CurrentEncoding;
            }
            var changed = false;
            var start_index = 0;
            while (true)
            {
                var index = s.IndexOf("<Optimize>true</Optimize>", start_index);
                if (index < 0) break;

                var replaced = false;
                var a = s.Substring(0, index).LastIndexOf("<PropertyGroup");
                var b = s.Substring(a).IndexOf('>');
                if (s.Substring(a, b).Contains("Debug"))
                {
                    s = s.Remove(index, 25);
                    s = s.Insert(index, "<Optimize>false</Optimize>");
                    replaced = true;
                    changed = true;
                }

                start_index = index + (replaced ? 2 : 1);
            }
            if (changed)
            {
                using (var writer = new StreamWriter(path, false, encoding))
                {
                    writer.Write(s);
                }
            }
        }

        static void Main(string[] args)
        {
            foreach (var path in Directory.GetFiles(PATH, "*.csproj", SearchOption.AllDirectories))
            {
                var dir_name = Path.GetDirectoryName(path);
                if (dir_name.EndsWith(".svn")) continue;
                if (dir_name.Split('\\').Contains("tags")) continue;
                CheckDebugOptimization(path);
            }
        }
    }
}
